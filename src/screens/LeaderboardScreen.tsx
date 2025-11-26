// src/screens/LeaderboardScreen.tsx
// ✅ VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig, PlayerScore, RootStackParamList } from '../types';
import Button from '../components/Button';
import { rotateRolesForNextRound, getRoleStatistics } from '../utils/roleRotation'; // 🆕 IMPORT

type LeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;
type LeaderboardScreenRouteProp = RouteProp<RootStackParamList, 'Leaderboard'>;

interface Props {
  navigation: LeaderboardScreenNavigationProp;
  route: LeaderboardScreenRouteProp;
}

const LeaderboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig, detectiveWon } = route.params;

  const isSaboteurModeActive = gameConfig.saboteurCount > 0 && gameConfig.players.length >= 5;
  const isGameFinished = gameConfig.currentRound >= gameConfig.totalRounds;
  const hasMoreRounds = gameConfig.currentRound < gameConfig.totalRounds;

  // 🆕 NEU: Rollen-Statistiken
  const roleStats = getRoleStatistics(gameConfig.players);

  const calculateNewScores = (): PlayerScore[] => {
    const currentScores = gameConfig.playerScores;
    
    return currentScores.map(playerScore => {
      let newScore = playerScore.score;
      
      const player = gameConfig.players.find(p => p.id === playerScore.playerId);
      
      if (detectiveWon) {
        if (playerScore.playerId === gameConfig.detective.id) {
          newScore += 3;
        }
        if (isSaboteurModeActive && player?.role === 'saboteur') {
          newScore += 5;
        }
      } else {
        if (player?.role === 'actor') {
          newScore += 1;
        }
        if (isSaboteurModeActive && player?.role === 'saboteur') {
          newScore += 0;
        }
      }
      
      return { ...playerScore, score: newScore };
    });
  };

  const newScores = calculateNewScores();
  const sortedScores = [...newScores].sort((a, b) => b.score - a.score);

  // 🆕 NEUE FUNKTION: Nächste Runde mit Rollen-Rotation
  const handleNextRound = () => {
    if (!hasMoreRounds) return;
    
    const nextGameConfig = rotateRolesForNextRound({
      ...gameConfig,
      playerScores: newScores
    });
    
    navigation.navigate('RoleReveal', { gameConfig: nextGameConfig });
  };

  const handleNewGame = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ClassicHome' }],
    });
  };

  const handleMainMenu = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainMenu' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>
          {detectiveWon ? '🎉 Detektiv gewinnt!' : '🏆 Akteure gewinnen!'}
        </Text>
        <Text style={styles.roundText}>
          Runde {gameConfig.currentRound} von {gameConfig.totalRounds}
        </Text>
        {isSaboteurModeActive && (
          <Text style={styles.saboteurModeText}>
            🕵️‍♂️ Saboteur-Modus aktiv
          </Text>
        )}
      </View>

      {/* 🆕 NEU: Rollen-Rotation Info */}
      {hasMoreRounds && (
        <View style={styles.rotationInfo}>
          <Text style={styles.rotationTitle}>Nächste Runde:</Text>
          <Text style={styles.rotationText}>
            🔍 Ein neuer Detektiv wird zufällig ausgewählt!
          </Text>
          <Text style={styles.rotationStats}>
            {gameConfig.usedDetectives?.length || 1} von {gameConfig.players.length} Spielern waren schon Detektiv
          </Text>
        </View>
      )}

      <ScrollView style={styles.leaderboardContainer}>
        {sortedScores.map((playerScore, index) => {
          const player = gameConfig.players.find(p => p.id === playerScore.playerId);
          const detectiveCount = player?.detectiveCount || 0;
          
          return (
            <View 
              key={playerScore.playerId} 
              style={[
                styles.scoreRow,
                index === 0 && styles.firstPlace,
                playerScore.playerId === gameConfig.detective.id && styles.detectiveRow
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.playerName}>{playerScore.playerName}</Text>
                <View style={styles.roleBadges}>
                  {playerScore.playerId === gameConfig.detective.id && (
                    <Text style={styles.detectiveBadge}>🔍 Detektiv</Text>
                  )}
                  {isSaboteurModeActive && player?.role === 'saboteur' && (
                    <Text style={styles.saboteurBadge}>🕵️‍♂️ Saboteur</Text>
                  )}
                  {/* 🆕 NEU: Detektiv-Count anzeigen */}
                  {detectiveCount > 0 && (
                    <Text style={styles.detectiveCountBadge}>
                      👑 {detectiveCount}x Detektiv
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{playerScore.score} Punkte</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {hasMoreRounds ? (
          <Button 
            title={`Nächste Runde (${gameConfig.currentRound + 1}/${gameConfig.totalRounds})`}
            onPress={handleNextRound}
            color="#c66b3d"
            size="large"
          />
        ) : (
          <>
            <Button 
              title="Neues Spiel starten" 
              onPress={handleNewGame}
              color="#c66b3d"
              size="large"
            />
            <Button 
              title="Hauptmenü" 
              onPress={handleMainMenu}
              color="#26495c"
              size="large"
            />
          </>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: '#26495c',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4a35a',
    textAlign: 'center',
    marginBottom: 10,
  },
  roundText: {
    fontSize: 16,
    color: '#e5e5dc',
    textAlign: 'center',
    marginBottom: 5,
  },
  saboteurModeText: {
    fontSize: 14,
    color: '#c4a35a',
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // 🆕 NEUE STYLES FÜR ROTATIONS-INFO
  rotationInfo: {
    backgroundColor: '#c4a35a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  rotationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 5,
  },
  rotationText: {
    fontSize: 14,
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 5,
  },
  rotationStats: {
    fontSize: 12,
    color: '#26495c',
    fontStyle: 'italic',
  },
  leaderboardContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    backgroundColor: '#26495c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  firstPlace: {
    backgroundColor: '#c4a35a',
    borderWidth: 3,
    borderColor: '#c66b3d',
  },
  detectiveRow: {
    borderWidth: 2,
    borderColor: '#c66b3d',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e5e5dc',
  },
  nameContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e5e5dc',
    marginBottom: 5,
  },
  roleBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  detectiveBadge: {
    fontSize: 12,
    color: '#c66b3d',
    fontWeight: '600',
  },
  saboteurBadge: {
    fontSize: 12,
    color: '#c4a35a',
    fontWeight: '600',
  },
  // 🆕 NEU: Detective Count Badge
  detectiveCountBadge: {
    fontSize: 11,
    color: '#e5e5dc',
    fontStyle: 'italic',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
});

export default LeaderboardScreen;