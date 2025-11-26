// adults/src/screens/PartyGameScreen.tsx - VOLLSTÄNDIG KORRIGIERT
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Vibration, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AdultsGameConfig, ADULTS_COLORS, ChaosRule, AdultsPlayer, PlayerScore, RouletteResult, AdultsRole } from '../types';
import { getRoleStatistics, getDrinkingStatistics } from '../utils/roleRotation';
import { INITIAL_TIME, calculateTimeAfterTip, formatTime, getTipCooldown } from '../utils/timerLogic';
import { setupBackgroundTimer, clearBackgroundTimer } from '../utils/backgroundTimer';
import { getTipForInstruction, getFallbackTip, Tip } from '../utils/tipsDatabase';
import { executeDrinkingAction, getDrinkingMessage } from '../utils/drinkingGame';
import { getRandomPartyQuestion } from '../utils/partyQuestions';
import { GameState } from '../types';
import Button from '../components/Button';
import ChaosRuleCard from '../components/ChaosRuleCard';
import DrinkingCounter from '../components/DrinkingCounter';
import RouletteWheel from '../components/RouletteWheel';

type RootStackParamList = {
  PartyHome: undefined;
  PartyPlayerSetup: { existingGameConfig?: AdultsGameConfig };
  PartyRoleReveal: { gameConfig: AdultsGameConfig };
  PartyGame: { gameConfig: AdultsGameConfig };
  PartyLeaderboard: { gameConfig: AdultsGameConfig; detectiveWon: boolean };
};

type PartyGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PartyGame'>;
type PartyGameScreenRouteProp = RouteProp<RootStackParamList, 'PartyGame'>;

interface Props {
  navigation: PartyGameScreenNavigationProp;
  route: PartyGameScreenRouteProp;
}

// 🟢 KORRIGIERT: Type Guard für AdultsRole
const isValidAdultsRole = (role: string): role is AdultsRole => {
  return role === 'detective' || role === 'actor' || role === 'saboteur';
};

// 🟢 VOLLSTÄNDIG KORRIGIERT: ensureAdultsPlayer mit allen Properties
const ensureAdultsPlayer = (player: any): AdultsPlayer => {
  const role: AdultsRole = isValidAdultsRole(player.role) ? player.role : 'actor';
  const lastRole: AdultsRole = isValidAdultsRole(player.lastRole) ? player.lastRole : 'actor';
  
  const adultPlayer: AdultsPlayer = {
    id: player.id || `player-${Date.now()}-${Math.random()}`,
    name: player.name || 'Unbekannter Spieler',
    role: role,
    instruction: player.instruction || '',
    drinks: typeof player.drinks === 'number' ? player.drinks : 0,
    chaosRuleViolations: typeof player.chaosRuleViolations === 'number' ? player.chaosRuleViolations : 0,
    hasBeenDetective: !!player.hasBeenDetective,
    detectiveCount: typeof player.detectiveCount === 'number' ? player.detectiveCount : 0,
    lastRole: lastRole
  };
  return adultPlayer;
};

const ensureAdultsPlayerScore = (playerScore: any): PlayerScore => {
  const adultPlayerScore: PlayerScore = {
    playerId: playerScore.playerId || '',
    playerName: playerScore.playerName || 'Unbekannter Spieler',
    score: typeof playerScore.score === 'number' ? playerScore.score : 0,
    drinks: typeof playerScore.drinks === 'number' ? playerScore.drinks : 0
  };
  return adultPlayerScore;
};

// 🟢 VOLLSTÄNDIG KORRIGIERT: ensureAdultsGameConfig
const ensureAdultsGameConfig = (config: any): AdultsGameConfig => {
  const safePlayers = (config.players || []).map(ensureAdultsPlayer);
  const safeDetective = ensureAdultsPlayer(config.detective);
  const safePlayerScores = (config.playerScores || []).map(ensureAdultsPlayerScore);
  
  const adultGameConfig: AdultsGameConfig = {
    players: safePlayers,
    detective: safeDetective,
    instruction: config.instruction || '',
    gameMode: config.gameMode || 'single',
    currentRound: typeof config.currentRound === 'number' ? config.currentRound : 1,
    totalRounds: typeof config.totalRounds === 'number' ? config.totalRounds : 1,
    playerScores: safePlayerScores,
    saboteurCount: typeof config.saboteurCount === 'number' ? config.saboteurCount : 0,
    activeChaosRules: Array.isArray(config.activeChaosRules) ? config.activeChaosRules : [],
    totalDrinks: typeof config.totalDrinks === 'number' ? config.totalDrinks : 0,
    usedDetectives: Array.isArray(config.usedDetectives) ? config.usedDetectives : [],
    roleRotationEnabled: !!config.roleRotationEnabled,
    nextDetectiveIndex: typeof config.nextDetectiveIndex === 'number' ? config.nextDetectiveIndex : -1
  };
  
  return adultGameConfig;
};

// 🟢 KORRIGIERT: getSafeDetective - Immer ensureAdultsPlayer verwenden
const getSafeDetective = (config: AdultsGameConfig): AdultsPlayer => {
  return ensureAdultsPlayer(config.detective);
};

// ✅ TYPE-GUARD FUNKTIONEN
const isAdultsPlayer = (player: any): player is AdultsPlayer => {
  return player && 
         typeof player.drinks === 'number' && 
         typeof player.chaosRuleViolations === 'number';
};

const isAdultsGameConfig = (config: any): config is AdultsGameConfig => {
  return config && 
         config.detective && 
         typeof config.detective.drinks === 'number' &&
         typeof config.detective.chaosRuleViolations === 'number' &&
         Array.isArray(config.players) &&
         config.players.every(isAdultsPlayer);
};

// Vereinfachte Trink-Strafen Funktion
const applyGameResultDrinking = (gameConfig: AdultsGameConfig, detectiveWon: boolean): AdultsGameConfig => {
  const updatedScores = [...gameConfig.playerScores];
  const updatedPlayers = [...gameConfig.players];
  let totalDrinksAdded = 0;

  const safeDetective = getSafeDetective(gameConfig);

  if (detectiveWon) {
    updatedScores.forEach(score => {
      if (score.playerId !== safeDetective.id) {
        score.drinks += 3;
        totalDrinksAdded += 3;
      }
    });
    updatedPlayers.forEach(player => {
      if (player.id !== safeDetective.id) {
        player.drinks += 3;
      }
    });
  } else {
    updatedScores.forEach(score => {
      if (score.playerId === safeDetective.id) {
        score.drinks += 3;
        totalDrinksAdded += 3;
      }
    });
    updatedPlayers.forEach(player => {
      if (player.id === safeDetective.id) {
        player.drinks += 3;
      }
    });
  }

  return {
    ...gameConfig,
    players: updatedPlayers,
    playerScores: updatedScores,
    totalDrinks: gameConfig.totalDrinks + totalDrinksAdded
  };
};

// ✅ KORRIGIERT: ModalType mit rouletteResult
type ModalType = 'none' | 'tip' | 'truthOrDrink' | 'rouletteInvite' | 'roulette' | 'rouletteResult' | 'success' | 'giveUp';

const PartyGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialGameConfig = ensureAdultsGameConfig(route.params.gameConfig);
  
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [tipsUsed, setTipsUsed] = useState(0);
  const [tipCooldown, setTipCooldown] = useState(0);
  const [isTipAvailable, setIsTipAvailable] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [activeChaosRules, setActiveChaosRules] = useState<ChaosRule[]>(initialGameConfig.activeChaosRules);
  const [currentGameConfig, setCurrentGameConfig] = useState<AdultsGameConfig>(initialGameConfig);
  const [drinkingHistory, setDrinkingHistory] = useState<string[]>([]);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [currentRouletteResult, setCurrentRouletteResult] = useState<RouletteResult | null>(null);
  const [roleStatistics, setRoleStatistics] = useState(getRoleStatistics(initialGameConfig));
  const [drinkingStats, setDrinkingStats] = useState(getDrinkingStatistics(initialGameConfig));

  // 🎯 NEU: Rollen-Statistiken aktualisieren
  useEffect(() => {
    const stats = getRoleStatistics(currentGameConfig);
    const drinkStats = getDrinkingStatistics(currentGameConfig);
    setRoleStatistics(stats);
    setDrinkingStats(drinkStats);
  }, [currentGameConfig]);

  // 🆕 NEUE FUNKTIONEN FÜR MANUELLE GETRÄNKE-ANPASSUNG
  const handleIncrementDrink = (playerId: string) => {
    setCurrentGameConfig(prevConfig => {
      const updatedPlayers = prevConfig.players.map(player =>
        player.id === playerId 
          ? { ...player, drinks: (player.drinks || 0) + 1 }
          : player
      );
      
      const updatedPlayerScores = prevConfig.playerScores.map(score =>
        score.playerId === playerId
          ? { ...score, drinks: (score.drinks || 0) + 1 }
          : score
      );

      const player = updatedPlayers.find(p => p.id === playerId);
      if (player) {
        const newHistoryEntry = `🍻 ${player.name} trinkt 1 Schlückchen (manuell hinzugefügt)`;
        setDrinkingHistory(prev => [newHistoryEntry, ...prev.slice(0, 4)]);
      }

      return {
        ...prevConfig,
        players: updatedPlayers,
        playerScores: updatedPlayerScores,
        totalDrinks: prevConfig.totalDrinks + 1
      };
    });
  };

  const handleDecrementDrink = (playerId: string) => {
    setCurrentGameConfig(prevConfig => {
      const player = prevConfig.players.find(p => p.id === playerId);
      const playerScore = prevConfig.playerScores.find(p => p.playerId === playerId);
      
      if (!player || !playerScore || (player.drinks || 0) <= 0) {
        return prevConfig;
      }

      const updatedPlayers = prevConfig.players.map(p =>
        p.id === playerId 
          ? { ...p, drinks: Math.max(0, (p.drinks || 0) - 1) }
          : p
      );
      
      const updatedPlayerScores = prevConfig.playerScores.map(score =>
        score.playerId === playerId
          ? { ...score, drinks: Math.max(0, (score.drinks || 0) - 1) }
          : score
      );

      const newHistoryEntry = `🔙 ${player.name} entfernt 1 Schlückchen`;
      setDrinkingHistory(prev => [newHistoryEntry, ...prev.slice(0, 4)]);

      return {
        ...prevConfig,
        players: updatedPlayers,
        playerScores: updatedPlayerScores,
        totalDrinks: Math.max(0, prevConfig.totalDrinks - 1)
      };
    });
  };

  const isWhisperModeActive = () => {
    return activeChaosRules.some(rule => rule.id === 'whisper_mode');
  };

  // Modal Management Functions
  const showModal = (modalType: ModalType) => {
    setActiveModal(modalType);
  };

  const hideModal = () => {
    setActiveModal('none');
  };

  const showTipModal = (tip: Tip) => {
    setCurrentTip(tip);
    showModal('tip');
  };

  const handleTipWithRoulette = () => {
    if (tipsUsed >= 3 || !isTipAvailable) return;
    
    const tip = getCurrentTip();
    showTipModal(tip);
    
    const newTime = calculateTimeAfterTip(timeLeft, tipsUsed);
    setTimeLeft(newTime);
    setTipsUsed(prev => prev + 1);
    
    const cooldownTime = getTipCooldown(tipsUsed);
    setTipCooldown(cooldownTime);
    setIsTipAvailable(false);

    triggerChaosRule('tip_used');

    if (newTime <= 0) {
      setGameState('finished');
      Vibration.vibrate(500);
      handleGameEnd(false);
    }
  };

  const showGameResultModal = (detectiveWon: boolean) => {
    const updatedConfig = applyGameResultDrinking(currentGameConfig, detectiveWon);
    setCurrentGameConfig(updatedConfig);

    if (detectiveWon) {
      showModal('success');
    } else {
      if (currentGameConfig.gameMode !== 'single') {
        navigation.navigate('PartyLeaderboard', { 
          gameConfig: updatedConfig, 
          detectiveWon: false 
        });
      } else {
        navigation.navigate('PartyHome');
      }
    }
  };

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
            handleGameEnd(false);
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
  }, [gameState, timeLeft]);

  const getCurrentTip = (): Tip => {
    const tip = getTipForInstruction(currentGameConfig.instruction, tipsUsed + 1);
    return tip || getFallbackTip(tipsUsed + 1);
  };

  const triggerChaosRule = (triggerType: 'start' | 'wrong_guess' | 'correct_guess' | 'random' | 'tip_used') => {
    const applicableRules = activeChaosRules.filter(rule => rule.trigger === triggerType);
    
    if (applicableRules.length > 0) {
      const randomRule = applicableRules[Math.floor(Math.random() * applicableRules.length)];
      executeChaosRule(randomRule);
    }
  };

  const executeChaosRule = (rule: ChaosRule) => {
    const safeDetective = getSafeDetective(currentGameConfig);
    const action = executeDrinkingAction(
      rule, 
      currentGameConfig.players, 
      safeDetective, 
      currentGameConfig.playerScores
    );
    const message = getDrinkingMessage(action);
    
    setDrinkingHistory(prev => [message, ...prev.slice(0, 4)]);
    setCurrentGameConfig(prev => ({
      ...prev,
      totalDrinks: prev.totalDrinks + action.amount
    }));
  };

  const handleStart = () => {
    setGameState('running');
    triggerChaosRule('start');
  };

  const handlePauseResume = () => {
    setGameState(prev => prev === 'running' ? 'paused' : 'running');
  };

  const handleTip = () => {
    handleTipWithRoulette();
  };

  const handleCorrectGuess = () => {
    setGameState('finished');
    showGameResultModal(true);
    triggerChaosRule('correct_guess');
  };

  const handleWrongGuess = () => {
    triggerChaosRule('wrong_guess');
    setCurrentQuestion(getRandomPartyQuestion());
    showModal('truthOrDrink');
  };

  const handleTruthOrDrinkChoice = (choice: 'truth' | 'drink') => {
    hideModal();
    
    if (choice === 'truth') {
      Alert.alert(
        '🎯 WAHRHEIT',
        `Frage: ${currentQuestion}\n\nAntworte ehrlich!`,
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      const safeDetective = getSafeDetective(currentGameConfig);
      executeDrinkingAction(
        {
          id: 'truth_or_drink',
          name: 'Wahrheit oder Drink',
          description: 'Spieler wählt Drink statt Wahrheit',
          duration: 'instant',
          trigger: 'wrong_guess',
          drinkingAction: { type: 'shot', amount: 1, target: 'detective' }
        },
        currentGameConfig.players,
        safeDetective,
        currentGameConfig.playerScores
      );
    }
  };

  const handleRouletteResult = (result: RouletteResult) => {
    setCurrentRouletteResult(result);
    showModal('rouletteResult');
    
    if (result.drinks > 0) {
      const safeDetective = getSafeDetective(currentGameConfig);
      const action = executeDrinkingAction(
        {
          id: 'roulette',
          name: 'Roulette',
          description: result.penalty,
          duration: 'instant',
          trigger: 'random',
          drinkingAction: { type: result.type, amount: result.drinks, target: result.target || 'player' }
        },
        currentGameConfig.players,
        safeDetective,
        currentGameConfig.playerScores
      );
      
      const message = getDrinkingMessage(action);
      setDrinkingHistory(prev => [message, ...prev.slice(0, 4)]);
      
      setCurrentGameConfig(prev => ({
        ...prev,
        totalDrinks: prev.totalDrinks + action.amount
      }));
    }
  };

  const handleRouletteResultConfirm = () => {
    hideModal();
    setCurrentRouletteResult(null);
  };

  const handleGiveUp = () => {
    showModal('giveUp');
  };

  const handleGameEnd = (detectiveWon: boolean) => {
    const updatedConfig = applyGameResultDrinking(currentGameConfig, detectiveWon);
    setCurrentGameConfig(updatedConfig);

    if (currentGameConfig.gameMode !== 'single') {
      navigation.navigate('PartyLeaderboard', { 
        gameConfig: updatedConfig, 
        detectiveWon 
      });
    } else {
      navigation.navigate('PartyHome');
    }
  };

  const handleSuccessConfirm = () => {
    hideModal();
    if (currentGameConfig.gameMode !== 'single') {
      navigation.navigate('PartyLeaderboard', { 
        gameConfig: currentGameConfig, 
        detectiveWon: true 
      });
    } else {
      navigation.navigate('PartyHome');
    }
  };

  const handleGiveUpConfirm = () => {
    setGameState('finished');
    hideModal();
    handleGameEnd(false);
  };

  const canUseTip = tipsUsed < 3 && isTipAvailable && gameState === 'running';
  const isGameActive = gameState === 'running' || gameState === 'paused';
  const isGameFinished = gameState === 'finished';

  // 🆕 AKTUALISIERTE renderDrinkingCounters FUNKTION
  const renderDrinkingCounters = () => {
    const safeDetective = getSafeDetective(currentGameConfig);
    return currentGameConfig.playerScores.map((playerScore) => (
      <DrinkingCounter
        key={playerScore.playerId}
        playerName={playerScore.playerName}
        drinks={playerScore.drinks}
        isDetective={playerScore.playerId === safeDetective.id}
        onIncrement={() => handleIncrementDrink(playerScore.playerId)}
        onDecrement={() => handleDecrementDrink(playerScore.playerId)}
      />
    ));
  };

  // 🎯 NEU: Rollen-Info Komponente
  const renderRoleInfo = () => {
    if (!currentGameConfig.roleRotationEnabled) return null;

    return (
      <View style={styles.roleInfoSection}>
        <Text style={styles.sectionTitle}>🔄 ROLLEN-ROTATION</Text>
        <View style={styles.roleStats}>
          <Text style={styles.roleStatText}>
            Runde {currentGameConfig.currentRound}/{currentGameConfig.totalRounds}
          </Text>
          <Text style={styles.roleStatText}>
            Detektiv: {currentGameConfig.detective.name} ({currentGameConfig.detective.detectiveCount || 1}x)
          </Text>
          <Text style={styles.roleStatText}>
            Nächster Wechsel: Runde {currentGameConfig.currentRound + 1}
          </Text>
        </View>
      </View>
    );
  };

  const renderModal = () => {
    if (activeModal === 'none') return null;

    const safeDetective = getSafeDetective(currentGameConfig);

    const modalConfigs = {
      tip: {
        title: `💡 HINWEIS STUFE ${currentTip?.level}`,
        content: currentTip?.text || '',
        type: 'info' as const,
        showRouletteAfter: true
      },
      truthOrDrink: {
        title: '🎯 WAHRHEIT ODER SHOT?',
        content: currentQuestion,
        type: 'choice' as const
      },
      rouletteInvite: {
        title: 'ROULETTE-ZEIT!',
        content: 'Nach deinem Tipp ist Roulette-Zeit!\n\nDreh am Rad und finde heraus, was passiert!',
        type: 'action' as const
      },
      roulette: {
        title: '🎲 RUSSISCH ROULETTE',
        content: '',
        type: 'roulette' as const
      },
      rouletteResult: {
        title: '🎲 ROULETTE-ERGEBNIS',
        content: currentRouletteResult?.text || 'Ergebnis wird geladen...',
        type: 'rouletteResult' as const
      },
      success: {
        title: 'PARTY GEWONNEN!',
        content: `Glückwunsch ${safeDetective.name}!\nDu hast die geheime Anweisung erraten!\n\n🍻 Alle anderen trinken 3 Schlucke!`,
        type: 'success' as const
      },
      giveUp: {
        title: 'PARTY BEENDEN',
        content: `Die geheime Anweisung war:\n"${currentGameConfig.instruction}"\n\n🍻 ${safeDetective.name} trinkt 3 Schlucke!`,
        type: 'danger' as const
      }
    };

    const config = modalConfigs[activeModal];

    return (
      <Modal visible={true} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={config.type === 'info' ? () => {
          hideModal();
          if (config.showRouletteAfter) {
            setTimeout(() => showModal('rouletteInvite'), 300);
          }
        } : undefined}>
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContainer,
              styles[`${config.type}Modal`]
            ]}>
              {config.type !== 'roulette' && config.type !== 'rouletteResult' && (
                <>
                  <Text style={styles.modalIcon}>
                    {config.type === 'success' ? '🎉' : 
                     config.type === 'danger' ? '🏳️' : 
                     config.type === 'info' ? '💡' : 
                     '🎯'}
                  </Text>
                  <Text style={styles.modalTitle}>{config.title}</Text>
                  <Text style={styles.modalText}>{config.content}</Text>
                </>
              )}

              {config.type === 'roulette' && (
                <>
                  <Text style={styles.modalTitle}>{config.title}</Text>
                  <RouletteWheel onSpinComplete={handleRouletteResult} />
                </>
              )}

              {config.type === 'rouletteResult' && currentRouletteResult && (
                <>
                  <Text style={styles.modalIcon}>
                    {currentRouletteResult.drinks > 0 ? '💥' : '🎉'}
                  </Text>
                  <Text style={styles.modalTitle}>{config.title}</Text>
                  <Text style={styles.modalText}>{currentRouletteResult.text}</Text>
                  
                  {currentRouletteResult.drinks > 0 && (
                    <View style={styles.rouletteResultDetails}>
                      <Text style={styles.rouletteResultText}>
                        {currentRouletteResult.target === 'all' ? '👥 ALLE trinken:' : 
                         currentRouletteResult.target === 'detective' ? `🔍 ${safeDetective.name} trinkt:` : 
                         '🎯 AUSERWÄHLTER trinkt:'}
                      </Text>
                      <Text style={styles.rouletteResultDrinks}>
                        {currentRouletteResult.drinks} {currentRouletteResult.type === 'sip' ? 'Schluck(e) 🍺' : 'Shot(s) 🥃'}
                      </Text>
                      <Text style={styles.rouletteResultPenalty}>
                        {currentRouletteResult.penalty}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {isWhisperModeActive() && config.type !== 'roulette' && (
                <View style={styles.whisperWarning}>
                  <Text style={styles.whisperWarningText}>
                    🤫 FLÜSTERMODUS AKTIV! Denkt daran leise zu sprechen!
                  </Text>
                </View>
              )}

              <View style={styles.modalButtonRow}>
                {config.type === 'info' && (
                  <Text style={styles.modalHint}>Tippe um fortzufahren → Roulette</Text>
                )}
                
                {config.type === 'choice' && (
                  <>
                    <Button 
                      title="🤫 WAHRHEIT" 
                      onPress={() => handleTruthOrDrinkChoice('truth')}
                      color={ADULTS_COLORS.primary}
                      size="large"
                    />
                    <Button 
                      title="🥃 LIEBER TRINKEN!" 
                      onPress={() => handleTruthOrDrinkChoice('drink')}
                      color={ADULTS_COLORS.danger}
                      size="large"
                    />
                  </>
                )}
                
                {config.type === 'action' && (
                  <Button 
                    title="🎯 JETZT DREHEN!" 
                    onPress={() => showModal('roulette')}
                    color={ADULTS_COLORS.danger}
                    size="large"
                  />
                )}
                
                {config.type === 'roulette' && (
                  <Button 
                    title="🔙 ZURÜCK" 
                    onPress={hideModal}
                    color={ADULTS_COLORS.primary}
                    size="medium"
                  />
                )}
                
                {config.type === 'rouletteResult' && currentRouletteResult && (
                  <Button 
                    title={currentRouletteResult.drinks > 0 ? "🍻 ZUM WOHL!" : "🎉 WEITER"} 
                    onPress={handleRouletteResultConfirm}
                    color={currentRouletteResult.drinks > 0 ? ADULTS_COLORS.danger : ADULTS_COLORS.success}
                    size="large"
                  />
                )}
                
                {config.type === 'success' && (
                  <Button 
                    title="🎊 WEITER" 
                    onPress={handleSuccessConfirm}
                    color={ADULTS_COLORS.success}
                    size="large"
                  />
                )}
                
                {config.type === 'danger' && (
                  <Button 
                    title="OK" 
                    onPress={handleGiveUpConfirm}
                    color={ADULTS_COLORS.danger}
                    size="large"
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.detectiveContainer}>
          <Text style={styles.detectiveLabel}>🔍 PARTY-DETEKTIV:</Text>
          <Text style={styles.detectiveName}>{getSafeDetective(currentGameConfig).name}</Text>
          {/* 🎯 NEU: Detektiv-Statistik im Header */}
          {currentGameConfig.roleRotationEnabled && (
            <Text style={styles.detectiveStats}>
              {currentGameConfig.detective.detectiveCount || 1}x Detektiv | 🍻 {currentGameConfig.detective.drinks} Getränke
            </Text>
          )}
        </View>

        <View style={styles.timerContainer}>
          <Text style={[
            styles.timerText,
            timeLeft < 60 && styles.timerCritical
          ]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>PARTY-ZEIT</Text>
        </View>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* 🎯 NEU: Rollen-Info Section */}
        {renderRoleInfo()}

        {/* CHAOS REGELN SECTION */}
        <View style={styles.chaosRulesSection}>
          <Text style={styles.sectionTitle}>🎭 AKTIVE CHAOS-REGELN</Text>
          {activeChaosRules.map((rule) => (
            <ChaosRuleCard key={rule.id} rule={rule} isActive={true} />
          ))}
        </View>

        {/* TRINK-STATISTIKEN SECTION */}
        <View style={styles.drinkingSection}>
          <Text style={styles.sectionTitle}>🍻 TRINK-STATISTIK</Text>
          <View style={styles.totalDrinks}>
            <Text style={styles.totalDrinksText}>
              GESAMT: {currentGameConfig.totalDrinks} GETRÄNKE
            </Text>
          </View>
          <View style={styles.drinkingCountersGrid}>
            {renderDrinkingCounters()}
          </View>
        </View>

        {/* LETZTE AKTIONEN SECTION */}
        {drinkingHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>📜 LETZTE AKTIONEN</Text>
            {drinkingHistory.map((action, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>{action}</Text>
              </View>
            ))}
          </View>
        )}

        {/* TIPPS INFO SECTION */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsText}>
            Tipps verwendet: {tipsUsed}/3
          </Text>
          
          {!isTipAvailable && tipCooldown > 0 && (
            <Text style={styles.cooldownText}>
              Nächster Tipp in: {formatTime(tipCooldown)}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* BUTTON CONTAINER */}
      <View style={styles.buttonContainer}>
        {!isGameActive && !isGameFinished && (
          <Button 
            title="🎉 PARTY STARTEN!" 
            onPress={handleStart}
            color={ADULTS_COLORS.danger}
            size="large"
          />
        )}
        
        {isGameActive && (
          <>
            <Button 
              title={gameState === 'paused' ? '▶️ WEITER' : '⏸️ PAUSE'} 
              onPress={handlePauseResume}
              color={ADULTS_COLORS.primary}
              size="large"
            />
            <Button 
              title={`💡 TIPP (${tipsUsed}/3)`}
              onPress={handleTip}
              disabled={!canUseTip}
              color={canUseTip ? ADULTS_COLORS.warning : ADULTS_COLORS.primary}
              size="large"
            />
          </>
        )}

        {!isGameFinished && (
          <>
            <Button 
              title="✅ RICHTIG ERRATEN!" 
              onPress={handleCorrectGuess}
              color={ADULTS_COLORS.success}
              size="large"
            />
            <Button 
              title="❌ FALSCH ERRATEN" 
              onPress={handleWrongGuess}
              color={ADULTS_COLORS.danger}
              size="large"
            />
          </>
        )}

        <Button 
          title="🏳️ AUFGEBEN" 
          onPress={handleGiveUp}
          color={ADULTS_COLORS.primary}
          size="large"
        />
      </View>

      {/* UNIFIED MODAL RENDERER */}
      {renderModal()}
    </View>
  );
};

// Styles (bleiben unverändert)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ADULTS_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: ADULTS_COLORS.primary,
    borderBottomWidth: 2,
    borderBottomColor: ADULTS_COLORS.accent,
  },
  detectiveContainer: {
    flex: 1,
  },
  detectiveLabel: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  detectiveName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 3,
  },
  detectiveStats: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 2,
  },
  timerCritical: {
    color: ADULTS_COLORS.danger,
  },
  timerLabel: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },
  roleInfoSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.warning,
  },
  roleStats: {
    gap: 5,
  },
  roleStatText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 15,
    textAlign: 'center',
  },
  chaosRulesSection: {
    marginBottom: 25,
  },
  drinkingSection: {
    marginBottom: 25,
  },
  totalDrinks: {
    backgroundColor: ADULTS_COLORS.danger,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  totalDrinksText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
  },
  drinkingCountersGrid: {
    gap: 10,
  },
  historySection: {
    marginBottom: 25,
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ADULTS_COLORS.accent,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  historyText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ADULTS_COLORS.accent,
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cooldownText: {
    fontSize: 14,
    color: ADULTS_COLORS.warning,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 15,
    gap: 8,
    backgroundColor: ADULTS_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: ADULTS_COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    padding: 30,
    borderRadius: 20,
    width: '95%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: ADULTS_COLORS.primary,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: ADULTS_COLORS.accent,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
    color: ADULTS_COLORS.accent,
  },
  modalHint: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
    color: ADULTS_COLORS.accent,
  },
  modalButtonRow: {
    width: '100%',
    gap: 10,
  },
  rouletteResultDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  rouletteResultText: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  rouletteResultDrinks: {
    fontSize: 20,
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rouletteResultPenalty: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  whisperWarning: {
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: ADULTS_COLORS.primary,
    width: '100%',
  },
  whisperWarningText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoModal: {
    borderColor: ADULTS_COLORS.warning,
  },
  choiceModal: {
    borderColor: ADULTS_COLORS.danger,
  },
  actionModal: {
    borderColor: ADULTS_COLORS.warning,
  },
  rouletteModal: {
    borderColor: ADULTS_COLORS.danger,
    maxHeight: '90%',
    width: '95%',
  },
  rouletteResultModal: {
    borderColor: ADULTS_COLORS.danger,
  },
  successModal: {
    borderColor: ADULTS_COLORS.success,
  },
  dangerModal: {
    borderColor: ADULTS_COLORS.danger,
  },
});

export default PartyGameScreen;