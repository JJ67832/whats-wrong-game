// KidsLeaderboardScreen.tsx
// VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList, GameConfig } from '../../../src/types';
import Button from '../components/Button';
import { rotateRolesForNextRound } from '../utils/roleRotation'; // 🆕 IMPORT

type KidsLeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsLeaderboard'>;
type KidsLeaderboardScreenRouteProp = RouteProp<RootStackParamList, 'KidsLeaderboard'>;

interface Props {
  navigation: KidsLeaderboardScreenNavigationProp;
  route: KidsLeaderboardScreenRouteProp;
}

const KidsLeaderboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig } = route.params;
  
  const isFinalRound = gameConfig.currentRound >= gameConfig.totalRounds;
  const hasMoreRounds = gameConfig.currentRound < gameConfig.totalRounds;

  // 🆕 NEUE FUNKTION: Nächste Runde mit Rollen-Rotation
  const handleNextRound = () => {
    if (!hasMoreRounds) return;
    
    const nextRoundConfig = rotateRolesForNextRound(gameConfig);
    navigation.navigate('KidsRoleReveal', { gameConfig: nextRoundConfig });
  };

  const handleNewGame = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'KidsHome' }],
    });
  };

  const handleMainMenu = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'KidsHome' }],
    });
  };

  // 🆕 NEU: Finde den nächsten Detektiv
  const getNextDetectiveInfo = () => {
    if (!hasMoreRounds || !gameConfig.usedDetectives) return null;
    
    const availablePlayers = gameConfig.players.filter(
      player => !gameConfig.usedDetectives?.includes(player.id)
    );
    
    if (availablePlayers.length === 0) {
      return "Zufälliger Spieler (alle waren schon Detektiv)";
    }
    
    return `Noch ${availablePlayers.length} von ${gameConfig.players.length} verfügbar`;
  };

  const nextDetectiveInfo = getNextDetectiveInfo();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isFinalRound ? 'Spiel beendet! 🏆' : `Runde ${gameConfig.currentRound} von ${gameConfig.totalRounds}`}
      </Text>

      {/* Punkte-Liste */}
      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>Punkteübersicht:</Text>
        {gameConfig.playerScores
          .sort((a, b) => b.score - a.score)
          .map((playerScore, index) => (
            <View key={playerScore.playerId} style={styles.scoreItem}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.playerName}>{playerScore.playerName}</Text>
              <Text style={styles.score}>{playerScore.score} Punkte</Text>
            </View>
          ))
        }
      </View>

      {/* 🆕 ANZEIGE: Rollen-Rotation Info */}
      {hasMoreRounds && (
        <View style={styles.nextRoundInfo}>
          <Text style={styles.nextRoundTitle}>Nächste Runde:</Text>
          <Text style={styles.nextRoundText}>
            🔍 Ein neuer Detektiv wird zufällig ausgewählt!
          </Text>
          <Text style={styles.rotationInfo}>
            {gameConfig.usedDetectives?.length || 1} von {gameConfig.players.length} Spielern waren schon Detektiv
          </Text>
          {nextDetectiveInfo && (
            <Text style={styles.availabilityInfo}>
              {nextDetectiveInfo}
            </Text>
          )}
        </View>
      )}

      {isFinalRound && (
        <View style={styles.finalInfo}>
          <Text style={styles.finalTitle}>🎉 Spiel abgeschlossen!</Text>
          <Text style={styles.finalText}>
            Alle {gameConfig.totalRounds} Runden wurden gespielt.
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {hasMoreRounds && (
          <Button
            title="Nächste Runde 🎯"
            onPress={handleNextRound}
            color="#06d6a0"
            size="large"
          />
        )}
        
        <Button
          title="Neues Spiel 🎮"
          onPress={handleNewGame}
          color="#4a90e2"
          size="large"
        />
        
        <Button
          title="Hauptmenü 🏠"
          onPress={handleMainMenu}
          color="#ffd166"
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8f4f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoresContainer: {
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  scoresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd166',
    width: 40,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    width: 80,
    textAlign: 'right',
  },
  // 🆕 NEUE STYLES FÜR ROTATIONS-INFO
  nextRoundInfo: {
    backgroundColor: '#ffd166',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  nextRoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 8,
  },
  nextRoundText: {
    fontSize: 16,
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 5,
  },
  rotationInfo: {
    fontSize: 14,
    color: '#4a90e2',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  availabilityInfo: {
    fontSize: 13,
    color: '#4a90e2',
    fontWeight: '600',
  },
  // 🆕 NEU: Final Info
  finalInfo: {
    backgroundColor: '#06d6a0',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  finalText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
});

export default KidsLeaderboardScreen;