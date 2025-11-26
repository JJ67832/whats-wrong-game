import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Vibration, Modal, TouchableWithoutFeedback } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig, RootStackParamList } from '../types';
import { INITIAL_TIME, calculateTimeAfterTip, formatTime, getTipCooldown } from '../utils/timerLogic';
import { setupBackgroundTimer, clearBackgroundTimer } from '../utils/backgroundTimer';
import { getTipForInstruction, getFallbackTip, Tip } from '../utils/tipsDatabase';
import { GameState } from '../types';
import Button from '../components/Button';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [tipsUsed, setTipsUsed] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [tipCooldown, setTipCooldown] = useState(0);
  const [isTipAvailable, setIsTipAvailable] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  const [meetingTimer, setMeetingTimer] = useState(180);
  const [showMeetingButton, setShowMeetingButton] = useState(false);

  const isSaboteurModeActive = gameConfig.saboteurCount > 0 && gameConfig.players.length >= 5;

  useEffect(() => {
    let cooldownIntervalId: number | null = null;

    if (tipCooldown > 0) {
      setIsTipAvailable(false);
      cooldownIntervalId = setupBackgroundTimer(() => {
        setTipCooldown(prev => {
          if (prev <= 1) {
            setIsTipAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownIntervalId !== null) {
        clearBackgroundTimer(cooldownIntervalId);
      }
    };
  }, [tipCooldown]);

  useEffect(() => {
    let gameIntervalId: number | null = null;

    if (gameState === 'running' && timeLeft > 0) {
      gameIntervalId = setupBackgroundTimer(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            Vibration.vibrate(500);
            
            if (gameConfig.gameMode !== 'single') {
              navigation.navigate('Leaderboard', { 
                gameConfig, 
                detectiveWon: false 
              });
            } else {
              Alert.alert(
                'Zeit abgelaufen!',
                `Die Zeit ist um! ${gameConfig.detective.name} hat es nicht geschafft.`,
                [{ 
                  text: 'OK', 
                  onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'ClassicHome' }],
                  }) 
                }]
              );
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (gameIntervalId !== null) {
        clearBackgroundTimer(gameIntervalId);
      }
    };
  }, [gameState, timeLeft, gameConfig, navigation]);

  useEffect(() => {
    let meetingIntervalId: number | null = null;

    if (gameState === 'running' && isSaboteurModeActive) {
      meetingIntervalId = setupBackgroundTimer(() => {
        setMeetingTimer(prev => {
          if (prev <= 1) {
            setShowMeetingButton(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (meetingIntervalId !== null) {
        clearBackgroundTimer(meetingIntervalId);
      }
    };
  }, [gameState, isSaboteurModeActive]);

  const getCurrentTip = (): Tip => {
    const tip = getTipForInstruction(gameConfig.instruction, tipsUsed + 1);
    return tip || getFallbackTip(tipsUsed + 1);
  };

  const handleStart = () => {
    setGameState('running');
  };

  const handlePauseResume = () => {
    setGameState(prev => prev === 'running' ? 'paused' : 'running');
  };

  const handleTip = () => {
    if (tipsUsed >= 3 || !isTipAvailable) return;
    
    const tip = getCurrentTip();
    setCurrentTip(tip);
    setShowTip(true);
    
    const newTime = calculateTimeAfterTip(timeLeft, tipsUsed);
    setTimeLeft(newTime);
    setTipsUsed(prev => prev + 1);
    
    const cooldownTime = getTipCooldown(tipsUsed);
    setTipCooldown(cooldownTime);
    setIsTipAvailable(false);

    if (newTime <= 0) {
      setGameState('finished');
      Vibration.vibrate(500);
      Alert.alert(
        'Zeit abgelaufen!',
        `Durch den Tipp ist die Zeit um! ${gameConfig.detective.name} hat es nicht geschafft.`,
        [{ 
          text: 'OK', 
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'ClassicHome' }],
          }) 
        }]
      );
    }
  };

  const handleStartMeeting = () => {
    if (!isSaboteurModeActive) return;
    
    setGameState('paused');
    navigation.navigate('SaboteurVoting', {
      gameConfig,
      onVoteComplete: () => {
        setMeetingTimer(180);
        setShowMeetingButton(false);
        setGameState('running');
      }
    });
  };

  const handleCorrectGuess = () => {
    setGameState('finished');
    setShowSuccessModal(true);
    
    if (gameConfig.gameMode !== 'single') {
      setTimeout(() => {
        navigation.navigate('Leaderboard', { 
          gameConfig, 
          detectiveWon: true 
        });
      }, 1500);
    }
  };

  const handleGiveUp = () => {
    setShowGiveUpModal(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    if (gameConfig.gameMode === 'single') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClassicHome' }],
      });
    }
  };

  const handleGiveUpConfirm = () => {
    setGameState('finished');
    setShowGiveUpModal(false);
    
    if (gameConfig.gameMode !== 'single') {
      navigation.navigate('Leaderboard', { 
        gameConfig, 
        detectiveWon: false 
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ClassicHome' }],
      });
    }
  };

  const canUseTip = tipsUsed < 3 && isTipAvailable && gameState === 'running';
  const isGameActive = gameState === 'running' || gameState === 'paused';
  const isGameFinished = gameState === 'finished';

  return (
    <View style={styles.container}>
      <View style={styles.detectiveContainer}>
        <Text style={styles.detectiveLabel}>🔍 Aktueller Detektiv:</Text>
        <Text style={styles.detectiveName}>{gameConfig.detective.name}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[
          styles.timerText,
          timeLeft < 60 && styles.timerCritical
        ]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.timerLabel}>Verbleibende Zeit</Text>
      </View>

      {isSaboteurModeActive && (
        <View style={styles.meetingContainer}>
          <Text style={styles.meetingText}>
            Nächste Abstimmung in: {formatTime(meetingTimer)}
          </Text>
        </View>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsText}>
          Tipps verwendet: {tipsUsed}/3
        </Text>
        
        {!isTipAvailable && tipCooldown > 0 && (
          <Text style={styles.cooldownText}>
            Nächster Tipp in: {formatTime(tipCooldown)}
          </Text>
        )}
        
        {isTipAvailable && tipsUsed < 3 && (
          <Text style={styles.readyText}>
            Tipp verfügbar (kostet 2 Minuten)
          </Text>
        )}
        
        {tipsUsed >= 3 && (
          <Text style={styles.maxTipsText}>
            Maximale Tipps erreicht
          </Text>
        )}
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {
            gameState === 'idle' ? 'Bereit' :
            gameState === 'running' ? 'Läuft' :
            gameState === 'paused' ? 'Pausiert' : 'Beendet'
          }
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isGameActive && !isGameFinished && (
          <Button 
            title="Timer starten" 
            onPress={handleStart}
            color="#c66b3d"
            size="large"
          />
        )}
        
        {isGameActive && (
          <>
            <Button 
              title={gameState === 'paused' ? 'Weiter' : 'Pause'} 
              onPress={handlePauseResume}
              color="#c4a35a"
              size="large"
            />
            <Button 
              title={`Tipp verwenden (${tipsUsed}/3)`}
              onPress={handleTip}
              disabled={!canUseTip}
              color={canUseTip ? "#26495c" : "#666"}
              size="large"
            />
          </>
        )}

        {showMeetingButton && isSaboteurModeActive && (
          <Button 
            title={`🤔 Saboteur-Abstimmung starten`}
            onPress={handleStartMeeting}
            color="#c66b3d"
            size="large"
          />
        )}

        {!isGameFinished && (
          <Button 
            title="✅ Richtig erraten!" 
            onPress={handleCorrectGuess}
            color="#c66b3d"
            size="large"
          />
        )}

        <Button 
          title="🏳️ Aufgeben" 
          onPress={handleGiveUp}
          color="#26495c"
          size="large"
        />
      </View>

      <Modal
        visible={showTip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTip(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTip(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.tipModal}>
              <Text style={styles.tipTitle}>Hinweis Stufe {currentTip?.level}</Text>
              <Text style={styles.tipText}>{currentTip?.text}</Text>
              <Text style={styles.tipHint}>Tippe um fortzufahren</Text>
              <Text style={styles.tipTime}>
                Zeitabzug: 2 Minuten
              </Text>
              {!isTipAvailable && (
                <Text style={styles.cooldownInfo}>
                  Nächster Hinweis verfügbar in: {formatTime(tipCooldown)}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultIcon}>🎉</Text>
            <Text style={styles.resultTitle}>Gewonnen!</Text>
            <Text style={styles.resultText}>
              Glückwunsch {gameConfig.detective.name}!{'\n'}
              Du hast die geheime Anweisung erraten!
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button 
                title="OK" 
                onPress={handleSuccessConfirm}
                color="#4CAF50"
                size="large"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showGiveUpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGiveUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultIcon}>🏳️</Text>
            <Text style={styles.resultTitle}>Spiel beenden</Text>
            <Text style={styles.resultText}>
              Die geheime Anweisung war:{'\n'}
              <Text style={styles.instructionText}>"{gameConfig.instruction}"</Text>
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button 
                title="OK" 
                onPress={handleGiveUpConfirm}
                color="#c66b3d"
                size="large"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5e5dc',
  },
  detectiveContainer: {
    backgroundColor: '#26495c',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detectiveLabel: {
    fontSize: 16,
    color: '#e5e5dc',
    marginBottom: 5,
  },
  detectiveName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c4a35a',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#26495c',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e5e5dc',
    marginBottom: 5,
  },
  timerCritical: {
    color: '#c66b3d',
  },
  timerLabel: {
    fontSize: 16,
    color: '#c4a35a',
  },
  meetingContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#26495c',
    padding: 10,
    borderRadius: 10,
  },
  meetingText: {
    fontSize: 14,
    color: '#e5e5dc',
    fontWeight: 'bold',
  },
  tipsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#26495c',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsText: {
    fontSize: 16,
    color: '#e5e5dc',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cooldownText: {
    fontSize: 14,
    color: '#c66b3d',
    fontWeight: 'bold',
  },
  readyText: {
    fontSize: 14,
    color: '#c4a35a',
  },
  maxTipsText: {
    fontSize: 14,
    color: '#c66b3d',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#26495c',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tipModal: {
    backgroundColor: '#26495c',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#c4a35a',
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 18,
    color: '#e5e5dc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  tipHint: {
    fontSize: 14,
    color: '#c66b3d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipTime: {
    fontSize: 12,
    color: '#c4a35a',
    textAlign: 'center',
    marginBottom: 10,
  },
  cooldownInfo: {
    fontSize: 12,
    color: '#c66b3d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultModal: {
    backgroundColor: '#26495c',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#c4a35a',
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#e5e5dc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  instructionText: {
    fontWeight: 'bold',
    color: '#c4a35a',
    fontStyle: 'italic',
  },
  modalButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default GameScreen;