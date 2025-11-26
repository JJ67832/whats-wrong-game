// src/screens/RoleRevealScreen.tsx
// ✅ VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation Support

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Vibration, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig } from '../types';
import { getTipForInstruction } from '../utils/tipsDatabase';
import Button from '../components/Button';

type RootStackParamList = {
  Home: undefined;
  PlayerSetup: undefined;
  RoleReveal: { gameConfig: GameConfig };
  Game: { gameConfig: GameConfig };
};

type RoleRevealScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RoleReveal'>;
type RoleRevealScreenRouteProp = RouteProp<RootStackParamList, 'RoleReveal'>;

interface Props {
  navigation: RoleRevealScreenNavigationProp;
  route: RoleRevealScreenRouteProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const characterEmojis = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷'];

const loadCharacterAssets = () => {
  try {
    return [
      require('../../assets/Characters/character1-min.png'),
      require('../../assets/Characters/character2-min.png'),
      require('../../assets/Characters/character3-min.png'),
      require('../../assets/Characters/character4-min.png'),
      require('../../assets/Characters/character5-min.png'),
      require('../../assets/Characters/character6-min.png'),
      require('../../assets/Characters/character7-min.png'),
    ];
  } catch (error) {
    console.log('Bilder konnten nicht geladen werden, verwende Emoji-Fallback');
    return null;
  }
};

const characterImages = loadCharacterAssets();
const useImages = characterImages !== null;

const getSaboteurTip = (instruction: string): string => {
  const tip = getTipForInstruction(instruction, 1);
  return tip?.text || "Beobachte die anderen Spieler genau und versuche die Anweisung zu erraten.";
};

const RoleRevealScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [characterAssignments, setCharacterAssignments] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const isSaboteurModeActive = gameConfig.saboteurCount > 0 && gameConfig.players.length >= 5;
 
  const coverOpacity = useRef(new Animated.Value(1)).current;
  const coverTranslateY = useRef(new Animated.Value(0)).current;

  const currentPlayer = gameConfig.players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === gameConfig.players.length - 1;

  useEffect(() => {
    const playerCount = gameConfig.players.length;
    const assignments = Array.from({ length: playerCount }, (_, i) => i % characterEmojis.length);
    for (let i = assignments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assignments[i], assignments[j]] = [assignments[j], assignments[i]];
    }
    setCharacterAssignments(assignments);
  }, [gameConfig.players.length, gameConfig.currentRound]); // 🆕 currentRound als Dependency

  const getCurrentCharacter = () => {
    if (characterAssignments.length === 0 || currentPlayerIndex >= characterAssignments.length) {
      return { type: 'emoji', value: characterEmojis[0] };
    }
   
    const assignment = characterAssignments[currentPlayerIndex];
   
    if (!useImages || imageErrors[assignment] || !characterImages?.[assignment]) {
      return {
        type: 'emoji',
        value: characterEmojis[assignment % characterEmojis.length]
      };
    }
   
    return {
      type: 'image',
      value: characterImages[assignment]
    };
  };

  const handleImageError = (characterIndex: number) => {
    console.warn(`Bild ${characterIndex} konnte nicht geladen werden`);
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
      navigation.navigate('Game', { gameConfig });
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setCardRevealed(false);
      setIsHolding(false);
      coverOpacity.setValue(1);
      coverTranslateY.setValue(0);
    }
  };

  const currentCharacter = getCurrentCharacter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rollenkarten</Text>
      
      {/* 🆕 NEU: Runden-Anzeige für Mehrrunden-Spiele */}
      {gameConfig.totalRounds > 1 && (
        <Text style={styles.roundInfo}>
          Runde {gameConfig.currentRound} von {gameConfig.totalRounds}
        </Text>
      )}
     
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
         
          <View style={styles.roleContainer}>
            {currentPlayer.role === 'detective' ? (
              <>
                <Text style={styles.roleIcon}>🔍</Text>
                <Text style={styles.roleTitle}>Du bist der Detektiv!</Text>
                <Text style={styles.roleDescription}>
                  Errate was die anderen falsch machen!{'\n\n'}
                  Sie befolgen eine geheime Anweisung.
                </Text>
                {/* 🆕 NEU: Detektiv-Count anzeigen */}
                {(currentPlayer.detectiveCount || 0) > 1 && (
                  <Text style={styles.detectiveCount}>
                    👑 Das ist deine {(currentPlayer.detectiveCount || 0)}. Runde als Detektiv!
                  </Text>
                )}
                <Text style={styles.revealInstruction}>
                  Bitte offenbare dich jetzt!
                </Text>
              </>
            ) : (currentPlayer.role === 'saboteur' && isSaboteurModeActive) ? (
              <>
                <Text style={styles.roleIcon}>🕵️‍♂️</Text>
                <Text style={styles.roleTitle}>Du bist der Saboteur!</Text>
                <Text style={styles.roleDescription}>
                  Arbeite heimlich mit dem Detektiv!{'\n\n'}
                  Tipp: {getSaboteurTip(gameConfig.instruction)}
                </Text>
                <Text style={styles.hint}>
                  Achtung: Alle 3 Minuten gibt es eine Abstimmung!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.roleIcon}>🎭</Text>
                <Text style={styles.roleTitle}>Du bist ein Akteur!</Text>
                <Text style={styles.roleDescription}>{currentPlayer.instruction}</Text>
                {/* 🆕 NEU: Frühere Detektiv-Einsätze anzeigen */}
                {(currentPlayer.detectiveCount || 0) > 0 && (
                  <Text style={styles.previousDetective}>
                    👑 War schon {(currentPlayer.detectiveCount || 0)}x Detektiv
                  </Text>
                )}
                <Text style={styles.hint}>
                  Befolge diese Anweisung während des Spiels!
                </Text>
              </>
            )}
          </View>
        </View>

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
        {isSaboteurModeActive && (
          <Text style={styles.saboteurHint}>
            🕵️‍♂️ Saboteur-Modus aktiv
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {cardRevealed && (
          <Button
            title={isLastPlayer ? "Zum Spiel" : "Nächster Spieler"}
            onPress={handleNext}
            color="#c66b3d"
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
    backgroundColor: '#e5e5dc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 10, // 🆕 Reduziert für Runden-Info
  },
  // 🆕 NEU: Runden-Info Style
  roundInfo: {
    fontSize: 18,
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
    height: 400,
  },
  card: {
    backgroundColor: '#26495c',
    padding: 25,
    borderRadius: 20,
    height: 400,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#e5e5dc',
    marginBottom: 15,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 16,
    color: '#e5e5dc',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  // 🆕 NEU: Detective Count Style
  detectiveCount: {
    fontSize: 14,
    color: '#c4a35a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  // 🆕 NEU: Previous Detective Style
  previousDetective: {
    fontSize: 12,
    color: '#c4a35a',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  revealInstruction: {
    fontSize: 14,
    color: '#c66b3d',
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  hint: {
    fontSize: 12,
    color: '#c4a35a',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  cardCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: '#c4a35a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    opacity: 0.7,
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
    backgroundColor: '#c4a35a',
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
    color: '#26495c',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coverInstruction: {
    fontSize: 16,
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coverHint: {
    backgroundColor: '#c66b3d',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  coverHintText: {
    fontSize: 24,
    color: '#e5e5dc',
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#26495c',
    marginBottom: 5,
  },
  saboteurHint: {
    fontSize: 14,
    color: '#c66b3d',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#26495c',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RoleRevealScreen;