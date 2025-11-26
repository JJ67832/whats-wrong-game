// adults/src/screens/PartyRoleRevealScreen.tsx - VOLLSTÄNDIG AKTUALISIERT
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Vibration, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AdultsGameConfig, ADULTS_COLORS } from '../types';
import { getRoleStatistics } from '../utils/roleRotation';
import Button from '../components/Button';

type RootStackParamList = {
  PartyHome: undefined;
  PartyPlayerSetup: undefined;
  PartyRoleReveal: { gameConfig: AdultsGameConfig };
  PartyGame: { gameConfig: AdultsGameConfig };
};

type PartyRoleRevealScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PartyRoleReveal'>;
type PartyRoleRevealScreenRouteProp = RouteProp<RootStackParamList, 'PartyRoleReveal'>;

interface Props {
  navigation: PartyRoleRevealScreenNavigationProp;
  route: PartyRoleRevealScreenRouteProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 🆕 PARTY CHARACTER ASSETS MIT FALLBACK
const loadPartyCharacterAssets = () => {
  try {
    return [
      require('../../assets/images/role-cards/character1.png'),
      require('../../assets/images/role-cards/character2.png'),
      require('../../assets/images/role-cards/character3.png'),
      require('../../assets/images/role-cards/character4.png'),
      require('../../assets/images/role-cards/character5.png'),
      require('../../assets/images/role-cards/character6.png'),
    ];
  } catch (error) {
    console.log('Party character images konnten nicht geladen werden, verwende Emoji-Fallback');
    return null;
  }
};

const partyCharacterImages = loadPartyCharacterAssets();
const usePartyImages = partyCharacterImages !== null;

// 🆕 PARTY EMOJIS ALS FALLBACK
const PARTY_EMOJIS = ['🎉', '🥃', '🎭', '🔥', '💃', '🕺', '🎲', '🍻'];

const PartyRoleRevealScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [characterAssignments, setCharacterAssignments] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const [roleStatistics, setRoleStatistics] = useState(getRoleStatistics(gameConfig));

  const coverOpacity = useRef(new Animated.Value(1)).current;
  const coverTranslateY = useRef(new Animated.Value(0)).current;

  const currentPlayer = gameConfig.players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === gameConfig.players.length - 1;

  useEffect(() => {
    const playerCount = gameConfig.players.length;
    const assignments = Array.from({ length: playerCount }, (_, i) => i % (usePartyImages ? partyCharacterImages!.length : PARTY_EMOJIS.length));
    for (let i = assignments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assignments[i], assignments[j]] = [assignments[j], assignments[i]];
    }
    setCharacterAssignments(assignments);
    setRoleStatistics(getRoleStatistics(gameConfig));
  }, [gameConfig.players.length]);

  // 🆕 VERBESSERTE CHARACTER-ZUWEISUNG MIT FALLBACK
  const getCurrentCharacter = () => {
    if (characterAssignments.length === 0 || currentPlayerIndex >= characterAssignments.length) {
      return { 
        type: usePartyImages ? 'image' : 'emoji', 
        value: usePartyImages ? partyCharacterImages![0] : PARTY_EMOJIS[0] 
      };
    }
   
    const assignment = characterAssignments[currentPlayerIndex];
   
    if (!usePartyImages || imageErrors[assignment] || !partyCharacterImages?.[assignment]) {
      return {
        type: 'emoji',
        value: PARTY_EMOJIS[assignment % PARTY_EMOJIS.length]
      };
    }
   
    return {
      type: 'image',
      value: partyCharacterImages[assignment]
    };
  };

  const handleImageError = (characterIndex: number) => {
    console.warn(`Party-Bild ${characterIndex} konnte nicht geladen werden`);
    setImageErrors(prev => ({ ...prev, [characterIndex]: true }));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsHolding(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (isHolding && gestureState.dy < 0) {
          const progress = Math.min(1, -gestureState.dy / 300);
          coverOpacity.setValue(1 - progress);
          coverTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsHolding(false);
       
        if (gestureState.dy < -150) {
          Animated.parallel([
            Animated.timing(coverOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(coverTranslateY, {
              toValue: -screenHeight,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start(() => {
            setCardRevealed(true);
            Vibration.vibrate(100);
          });
        } else {
          Animated.parallel([
            Animated.timing(coverOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(coverTranslateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (isLastPlayer) {
      navigation.navigate('PartyGame', { gameConfig });
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setCardRevealed(false);
      setIsHolding(false);
      coverOpacity.setValue(1);
      coverTranslateY.setValue(0);
    }
  };

  const currentCharacter = getCurrentCharacter();

  // 🎯 NEU: Rollen-Statistiken für aktuellen Spieler
  const getPlayerRoleStats = () => {
    const detectiveCount = currentPlayer.detectiveCount || 0;
    const drinks = currentPlayer.drinks || 0;
    const chaosViolations = currentPlayer.chaosRuleViolations || 0;
    
    return {
      detectiveCount,
      drinks,
      chaosViolations,
      isFirstTimeDetective: detectiveCount === 1 && currentPlayer.role === 'detective',
      isVeteran: detectiveCount > 1
    };
  };

  const playerStats = getPlayerRoleStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎭 PARTY-ROLLEN 🎭</Text>
     
      {/* 🎯 NEU: Runden-Info für Rollen-Rotation */}
      {gameConfig.roleRotationEnabled && (
        <View style={styles.roundInfo}>
          <Text style={styles.roundText}>
            RUNDE {gameConfig.currentRound} VON {gameConfig.totalRounds}
          </Text>
          <Text style={styles.rotationInfo}>
            {playerStats.isFirstTimeDetective ? '🎉 ERSTMALS DETEKTIV!' : 
             playerStats.isVeteran ? `🎯 ERFAHRENER DETEKTIV (${playerStats.detectiveCount}x)` : 
             '🎪 PARTY-AKTEUR'}
          </Text>
        </View>
      )}
     
      <View style={styles.cardContainer}>
        {/* 🆕 HAUPTKARTE MIT ROLLEN-STATISTIKEN */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.playerName}>{currentPlayer.name}</Text>
           
            <View style={styles.roleContainer}>
              {currentPlayer.role === 'detective' ? (
                <>
                  <Text style={styles.roleIcon}>🔍</Text>
                  <Text style={styles.roleTitle}>DU BIST DER DETEKTIV!</Text>
                  
                  {/* 🎯 NEU: Detektiv-Statistiken */}
                  <View style={styles.statsContainer}>
                    <Text style={styles.statItem}>
                      🎯 Detektiv: {playerStats.detectiveCount}x
                    </Text>
                    <Text style={styles.statItem}>
                      🍻 Getrunken: {playerStats.drinks}
                    </Text>
                    <Text style={styles.statItem}>
                      ⚠️ Chaos-Verstöße: {playerStats.chaosViolations}
                    </Text>
                  </View>
                  
                  <Text style={styles.roleDescription}>
                    Errate was die anderen falsch machen!{'\n\n'}
                    Sie befolgen eine geheime Party-Anweisung.
                  </Text>
                  <Text style={styles.revealInstruction}>
                    Bitte offenbare dich jetzt der Party-Crew!
                  </Text>
                  <Text style={styles.partyHint}>
                    🍻 Trink-Regeln: Bei falscher Vermutung = 1 Shot!
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.roleIcon}>🎪</Text>
                  <Text style={styles.roleTitle}>DU BIST EIN PARTY-AKTEUR!</Text>
                  
                  {/* 🎯 NEU: Akteur-Statistiken */}
                  <View style={styles.statsContainer}>
                    <Text style={styles.statItem}>
                      🎯 War Detektiv: {playerStats.detectiveCount}x
                    </Text>
                    <Text style={styles.statItem}>
                      🍻 Getrunken: {playerStats.drinks}
                    </Text>
                  </View>
                  
                  <Text style={styles.roleDescription}>{currentPlayer.instruction}</Text>
                  <Text style={styles.hint}>
                    Befolge diese Anweisung während der Party!
                  </Text>
                  <Text style={styles.chaosWarning}>
                    ⚠️ Achtung: {gameConfig.activeChaosRules.length} Chaos-Regeln aktiv!
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* 🆕 COVER-KARTE MIT BILD/EMOJI */}
        <Animated.View
          style={[
            styles.cardCover,
            {
              opacity: coverOpacity,
              transform: [{ translateY: coverTranslateY }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          {currentCharacter.type === 'image' ? (
            <Image
              source={currentCharacter.value}
              style={styles.backgroundImage}
              resizeMode="cover"
              onError={() => handleImageError(characterAssignments[currentPlayerIndex])}
            />
          ) : (
            <View style={styles.emojiContainer}>
              <Text style={styles.characterEmoji}>{currentCharacter.value}</Text>
            </View>
          )}
          
          <View style={styles.backgroundOverlay} />
         
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>{currentPlayer.name}</Text>
            
            {/* 🎯 NEU: Rollen-Info auf Cover */}
            {gameConfig.roleRotationEnabled && (
              <View style={styles.coverStats}>
                <Text style={styles.coverStatText}>
                  🎯 Detektiv: {playerStats.detectiveCount}x
                </Text>
                <Text style={styles.coverStatText}>
                  🍻 Getrunken: {playerStats.drinks}
                </Text>
              </View>
            )}
            
            <Text style={styles.coverInstruction}>
              {isHolding ? "Weiter nach oben ziehen..." : "Halten und nach oben ziehen"}
            </Text>
            <View style={styles.coverHint}>
              <Text style={styles.coverHintText}>↑</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Spieler {currentPlayerIndex + 1} von {gameConfig.players.length}
        </Text>
        <Text style={styles.chaosInfo}>
          🎲 {gameConfig.activeChaosRules.length} Chaos-Regeln aktiv
        </Text>
        
        {/* 🎯 NEU: Rotations-Fortschritt */}
        {gameConfig.roleRotationEnabled && (
          <Text style={styles.rotationProgress}>
            🔄 Rotation aktiv - Runde {gameConfig.currentRound}/{gameConfig.totalRounds}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {cardRevealed && (
          <Button
            title={isLastPlayer ? "🎉 ZUR PARTY!" : "NÄCHSTER PARTY-GAST"}
            onPress={handleNext}
            color={ADULTS_COLORS.danger}
            size="large"
          />
        )}
       
        {!cardRevealed && (
          <Text style={styles.instructionText}>
            Gib das Gerät an {currentPlayer.name} weiter
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: ADULTS_COLORS.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  roundInfo: {
    backgroundColor: ADULTS_COLORS.warning,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  roundText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.secondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  rotationInfo: {
    fontSize: 14,
    color: ADULTS_COLORS.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
    height: 450,
  },
  card: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 25,
    borderRadius: 20,
    height: 450,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: ADULTS_COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  roleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  roleIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 15,
    textAlign: 'center',
  },
  // 🎯 NEU: Stats Container
  statsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  statItem: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  revealInstruction: {
    fontSize: 14,
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  partyHint: {
    fontSize: 12,
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  hint: {
    fontSize: 12,
    color: ADULTS_COLORS.warning,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  chaosWarning: {
    fontSize: 12,
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 450,
    backgroundColor: ADULTS_COLORS.danger,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: ADULTS_COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  emojiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 100,
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: ADULTS_COLORS.danger,
    opacity: 0.5,
  },
  coverContent: {
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // 🎯 NEU: Cover Stats
  coverStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
    width: '100%',
  },
  coverStatText: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 3,
    fontWeight: '600',
  },
  coverInstruction: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coverHint: {
    backgroundColor: ADULTS_COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  coverHintText: {
    fontSize: 24,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ADULTS_COLORS.accent,
  },
  progressText: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  chaosInfo: {
    fontSize: 14,
    color: ADULTS_COLORS.warning,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  // 🎯 NEU: Rotation Progress
  rotationProgress: {
    fontSize: 12,
    color: ADULTS_COLORS.success,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default PartyRoleRevealScreen;