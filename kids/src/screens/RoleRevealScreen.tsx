// KidsRoleRevealScreen.tsx
// VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation Support

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Vibration, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// KORRIGIERT: Import von globalen Typen
import { RootStackParamList, GameConfig } from '../../../src/types';
import Button from '../components/Button';

// KORRIGIERT: Verwende globale Typen
type KidsRoleRevealScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsRoleReveal'>;
type KidsRoleRevealScreenRouteProp = RouteProp<RootStackParamList, 'KidsRoleReveal'>;

interface Props {
  navigation: KidsRoleRevealScreenNavigationProp;
  route: KidsRoleRevealScreenRouteProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const characterEmojis = ['🐻', '🐰', '🐯', '🦊', '🐨', '🐼', '🐘', '🦁'];

const loadCharacterAssets = () => {
  try {
    return [
      require('../../assets/characters/kids_character1.png'),
      require('../../assets/characters/kids_character2.png'),
      require('../../assets/characters/kids_character3.png'),
      require('../../assets/characters/kids_character4.png'),
    ];
  } catch (error) {
    console.log('Kids-Bilder konnten nicht geladen werden, verwende Emoji-Fallback');
    return null;
  }
};

const characterImages = loadCharacterAssets();
const useImages = characterImages !== null;

const KidsRoleRevealScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [characterAssignments, setCharacterAssignments] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const coverOpacity = useRef(new Animated.Value(1)).current;
  const coverTranslateY = useRef(new Animated.Value(0)).current;

  const currentPlayer = gameConfig.players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === gameConfig.players.length - 1;

  // 🆕 AKTUALISIERT: Bessere Character-Zuweisung mit Rollen-Rotation
  useEffect(() => {
    const playerCount = gameConfig.players.length;
    const assignments = Array.from({ length: playerCount }, (_, i) => i % characterEmojis.length);
    
    // Mische die Zuordnungen für mehr Vielfalt
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
    console.warn(`Kids-Bild ${characterIndex} konnte nicht geladen werden`);
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
      // 🆕 AKTUALISIERT: Navigation mit aktuellem gameConfig
      navigation.navigate('KidsGame', { gameConfig });
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
      <Text style={styles.title}>Deine geheime Rolle! 🎭</Text>
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
                  Rate was die anderen falsch machen!{'\n\n'}
                  Sie haben eine geheime Aufgabe.
                </Text>
                <Text style={styles.revealInstruction}>
                  Zeige dich jetzt allen!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.roleIcon}>🎪</Text>
                <Text style={styles.roleTitle}>Du bist ein Schauspieler!</Text>
                <Text style={styles.roleDescription}>{currentPlayer.instruction}</Text>
                <Text style={styles.hint}>
                  Mach das während des Spiels! Aber nicht zu offensichtlich!
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
              {isHolding ? "Weiter hochziehen..." : "Halten und hochziehen"}
            </Text>
            <View style={styles.coverHint}>
              <Text style={styles.coverHintText}>↑</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Freund {currentPlayerIndex + 1} von {gameConfig.players.length}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {cardRevealed && (
          <Button
            title={isLastPlayer ? "Zum Spiel! 🎮" : "Nächster Freund 👉"}
            onPress={handleNext}
            color="#ffd166"
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
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 10, // 🆕 Reduziert für Runden-Info
  },
  // 🆕 NEU: Runden-Info Style
  roundInfo: {
    fontSize: 18,
    color: '#4a90e2',
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
    backgroundColor: '#4a90e2',
    padding: 25,
    borderRadius: 25,
    height: 400,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  roleIcon: {
    fontSize: 45,
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 15,
  },
  revealInstruction: {
    fontSize: 16,
    color: '#ffd166',
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  hint: {
    fontSize: 14,
    color: '#ffd166',
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
    backgroundColor: '#ffd166',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
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
    fontSize: 120,
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffd166',
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
    color: '#4a90e2',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coverInstruction: {
    fontSize: 18,
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  coverHint: {
    backgroundColor: '#06d6a0',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  coverHintText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#4a90e2',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#4a90e2',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default KidsRoleRevealScreen;