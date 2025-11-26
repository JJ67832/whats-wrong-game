// KidsGameScreen.tsx
// VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation Support

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Vibration, 
  Modal, 
  TouchableWithoutFeedback, 
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// KORRIGIERT: Import von globalen Typen
import { RootStackParamList, GameConfig, GameState } from '../../../src/types';
import { INITIAL_TIME, calculateTimeAfterTip, formatTime, getTipCooldown } from '../utils/timerLogic';
import { setupBackgroundTimer, clearBackgroundTimer } from '../utils/backgroundTimer';
import { getTipForInstruction, getFallbackTip, Tip } from '../utils/tipsDatabase';
import Button from '../components/Button';

// KORRIGIERT: Verwende globale Typen
type KidsGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsGame'>;
type KidsGameScreenRouteProp = RouteProp<RootStackParamList, 'KidsGame'>;

interface Props {
  navigation: KidsGameScreenNavigationProp;
  route: KidsGameScreenRouteProp;
}

const KidsGameScreen: React.FC<Props> = ({ navigation, route }) => {
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

  const scrollViewRef = useRef<ScrollView>(null);

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
            
            // 🆕 AKTUALISIERT: Navigation mit aktuellem gameConfig
            if (gameConfig.gameMode !== 'single') {
              navigation.navigate('KidsLeaderboard', { 
                gameConfig: {
                  ...gameConfig,
                  // Hier könnten Punkte aktualisiert werden
                }
              });
            } else {
              Alert.alert(
                'Zeit um! ⏰',
                `Die Zeit ist vorbei! ${gameConfig.detective.name} hat es nicht geschafft.`,
                [{ 
                  text: 'OK', 
                  onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'KidsHome' }],
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
        'Zeit um! ⏰',
        `Durch den Tipp ist die Zeit um! ${gameConfig.detective.name} hat es nicht geschafft.`,
        [{ 
          text: 'OK', 
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'KidsHome' }],
          }) 
        }]
      );
    }
  };

  const handleCorrectGuess = () => {
    setGameState('finished');
    setShowSuccessModal(true);
    
    if (gameConfig.gameMode !== 'single') {
      setTimeout(() => {
        // 🆕 AKTUALISIERT: Navigation mit aktuellem gameConfig
        navigation.navigate('KidsLeaderboard', { 
          gameConfig: {
            ...gameConfig,
            // Hier könnten Punkte für den Detektiv hinzugefügt werden
          }
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
        routes: [{ name: 'KidsHome' }],
      });
    }
  };

  const handleGiveUpConfirm = () => {
    setGameState('finished');
    setShowGiveUpModal(false);
    
    if (gameConfig.gameMode !== 'single') {
      // 🆕 AKTUALISIERT: Navigation mit aktuellem gameConfig
      navigation.navigate('KidsLeaderboard', { 
        gameConfig: {
          ...gameConfig,
          // Hier könnten Punkte aktualisiert werden
        }
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'KidsHome' }],
      });
    }
  };

  const canUseTip = tipsUsed < 3 && isTipAvailable && gameState === 'running';
  const isGameActive = gameState === 'running' || gameState === 'paused';
  const isGameFinished = gameState === 'finished';

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
      showsVerticalScrollIndicator={true}
    >
      {/* 🆕 NEU: Runden-Anzeige */}
      {gameConfig.totalRounds > 1 && (
        <View style={styles.roundContainer}>
          <Text style={styles.roundText}>
            Runde {gameConfig.currentRound} von {gameConfig.totalRounds}
          </Text>
        </View>
      )}

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
            title="Timer starten 🚀" 
            onPress={handleStart}
            color="#ffd166"
            size="large"
          />
        )}
        
        {isGameActive && (
          <>
            <Button 
              title={gameState === 'paused' ? 'Weiter ▶️' : 'Pause ⏸️'} 
              onPress={handlePauseResume}
              color="#06d6a0"
              size="large"
            />
            <Button 
              title={`Tipp verwenden 💡 (${tipsUsed}/3)`}
              onPress={handleTip}
              disabled={!canUseTip}
              color={canUseTip ? "#4a90e2" : "#666"}
              size="large"
            />
          </>
        )}

        {!isGameFinished && (
          <Button 
            title="✅ Richtig erraten!" 
            onPress={handleCorrectGuess}
            color="#ffd166"
            size="large"
          />
        )}

        <Button 
          title="🏳️ Aufgeben" 
          onPress={handleGiveUp}
          color="#4a90e2"
          size="large"
        />
      </View>

      {/* Modals */}
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
              Super {gameConfig.detective.name}!{'\n'}
              Du hast die geheime Aufgabe erraten!
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button 
                title="OK 👍" 
                onPress={handleSuccessConfirm}
                color="#06d6a0"
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
              Die geheime Aufgabe war:{'\n'}
              <Text style={styles.instructionText}>"{gameConfig.instruction}"</Text>
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button 
                title="OK 👌" 
                onPress={handleGiveUpConfirm}
                color="#ffd166"
                size="large"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#e8f4f8',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  // 🆕 NEU: Runden-Container
  roundContainer: {
    backgroundColor: '#06d6a0',
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roundText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detectiveContainer: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  detectiveLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 5,
  },
  detectiveName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffd166',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  timerText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  timerCritical: {
    color: '#ff6b6b',
  },
  timerLabel: {
    fontSize: 18,
    color: '#ffd166',
  },
  tipsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  tipsText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cooldownText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  readyText: {
    fontSize: 16,
    color: '#ffd166',
  },
  maxTipsText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#4a90e2',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tipModal: {
    backgroundColor: '#4a90e2',
    padding: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#ffd166',
  },
  tipTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  tipHint: {
    fontSize: 16,
    color: '#ff6b6b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipTime: {
    fontSize: 14,
    color: '#ffd166',
    textAlign: 'center',
    marginBottom: 10,
  },
  cooldownInfo: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultModal: {
    backgroundColor: '#4a90e2',
    padding: 30,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#ffd166',
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 25,
  },
  instructionText: {
    fontWeight: 'bold',
    color: '#ffd166',
    fontStyle: 'italic',
  },
  modalButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default KidsGameScreen;