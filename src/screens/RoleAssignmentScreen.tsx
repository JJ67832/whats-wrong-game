import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig } from '../types';
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

const RoleRevealScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const pan = useRef(new Animated.Value(0)).current;

  const currentPlayer = gameConfig.players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === gameConfig.players.length - 1;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Nur nach oben swipen erlauben
        if (gestureState.dy < 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Wenn hoch genug geswiped wurde, Karte offen lassen
        if (gestureState.dy < -100) {
          Animated.timing(pan, {
            toValue: -200,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setCardRevealed(true);
          });
        } else {
          // Sonst Karte wieder zuklappen
          Animated.timing(pan, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (isLastPlayer) {
      // Bevor zum Spiel gegangen wird, sicherstellen dass der Detektiv sich offenbart hat
      if (gameConfig.detective) {
        Alert.alert(
          'Detektiv offenbaren',
          `${gameConfig.detective.name}, bitte offenbare jetzt dass du der Detektiv bist!`,
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Game', { gameConfig }) 
            }
          ]
        );
      } else {
        navigation.navigate('Game', { gameConfig });
      }
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setCardRevealed(false);
      pan.setValue(0);
    }
  };

  const cardStyle = {
    transform: [{ translateY: pan }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rollenkarten</Text>
      
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[styles.card, cardStyle]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          
          {cardRevealed ? (
            <View style={styles.roleContainer}>
              {currentPlayer.role === 'detective' ? (
                <>
                  <Text style={styles.roleIcon}>🔍</Text>
                  <Text style={styles.roleTitle}>Du bist der Detektiv!</Text>
                  <Text style={styles.roleDescription}>
                    Deine Aufgabe:{'\n\n'}
                    Errate was die anderen Spieler falsch machen!{'\n\n'}
                    Sie befolgen alle eine geheime Anweisung, die du nicht kennst.
                  </Text>
                  <Text style={styles.revealInstruction}>
                    WICHTIG: Bitte offenbare dich jetzt als Detektiv!
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.roleIcon}>🎭</Text>
                  <Text style={styles.roleTitle}>Deine geheime Anweisung:</Text>
                  <Text style={styles.roleDescription}>{currentPlayer.instruction}</Text>
                  <Text style={styles.hint}>
                    Merke dir diese Anweisung und befolge sie während des Spiels!
                  </Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.hiddenContainer}>
              <Text style={styles.swipeHint}>↑ Hochwischen um Rolle zu sehen</Text>
              <Text style={styles.holdHint}>(Halten um die Karte offen zu lassen)</Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Spieler {currentPlayerIndex + 1} von {gameConfig.players.length}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {cardRevealed && (
          <Button 
            title={isLastPlayer ? "Zum Spiel" : "Nächster Spieler"}
            onPress={handleNext}
            color="#c66b3d"
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
    marginBottom: 30,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#26495c',
    padding: 30,
    borderRadius: 20,
    minHeight: 400,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleContainer: {
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 40,
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e5e5dc',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 18,
    color: '#e5e5dc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  revealInstruction: {
    fontSize: 16,
    color: '#c66b3d',
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  hint: {
    fontSize: 14,
    color: '#c4a35a',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  hiddenContainer: {
    alignItems: 'center',
  },
  swipeHint: {
    fontSize: 18,
    color: '#c4a35a',
    textAlign: 'center',
    marginBottom: 10,
  },
  holdHint: {
    fontSize: 14,
    color: '#c4a35a',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#26495c',
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