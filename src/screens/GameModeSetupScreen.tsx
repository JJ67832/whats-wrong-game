import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameMode, Player, GameConfig } from '../types';
import { getRandomInstruction } from '../utils/instructions';
import Button from '../components/Button';

type RootStackParamList = {
  Home: undefined;
  PlayerNameSetup: undefined;
  GameModeSetup: { playerNames: string[] };
  SaboteurModeSetup: { playerNames: string[]; gameMode: GameMode };
  RoleReveal: { gameConfig: GameConfig };
};

type GameModeSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameModeSetup'>;
type GameModeSetupScreenRouteProp = RouteProp<RootStackParamList, 'GameModeSetup'>;

interface Props {
  navigation: GameModeSetupScreenNavigationProp;
  route: GameModeSetupScreenRouteProp;
}

const createGameConfig = (playerNames: string[], gameMode: GameMode, saboteurCount: number = 0): GameConfig => {
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}-${Date.now()}`,
    name: name,
    role: 'actor',
    instruction: ''
  }));

  const detectiveIndex = Math.floor(Math.random() * players.length);
  const detective = {
    ...players[detectiveIndex],
    role: 'detective' as const
  };
  players[detectiveIndex] = detective;

  const instruction = getRandomInstruction();
  players.forEach(player => {
    if (player.role === 'actor') {
      player.instruction = instruction;
    }
  });

  const totalRounds = gameMode === 'single' ? 1 : 
                     gameMode === 'bo3' ? 3 : 
                     gameMode === 'bo5' ? 5 : 
                     gameMode === 'bo7' ? 7 : 10;

  const playerScores = players.map(player => ({
    playerId: player.id,
    playerName: player.name,
    score: 0
  }));

  return {
    players,
    detective,
    instruction,
    gameMode,
    currentRound: 1,
    totalRounds,
    playerScores,
    saboteurCount
  };
};

// Spielmodi mit Icons und Beschreibungen
const gameModes = [
  {
    id: 'single',
    gameMode: 'single' as GameMode,
    icon: '🎯',
    title: 'Eine Runde',
    description: 'Einzelnes Spiel\nKein Leaderboard',
    color: '#c66b3d'
  },
  {
    id: 'bo3',
    gameMode: 'bo3' as GameMode,
    icon: '🥉',
    title: 'Best of 3',
    description: '3 Runden\nMit Leaderboard',
    color: '#c4a35a'
  },
  {
    id: 'bo5',
    gameMode: 'bo5' as GameMode,
    icon: '🥈',
    title: 'Best of 5',
    description: '5 Runden\nMit Leaderboard',
    color: '#26495c'
  },
  {
    id: 'bo7',
    gameMode: 'bo7' as GameMode,
    icon: '🥇',
    title: 'Best of 7',
    description: '7 Runden\nMit Leaderboard',
    color: '#c66b3d'
  },
  {
    id: 'bo10',
    gameMode: 'bo10' as GameMode,
    icon: '🏆',
    title: 'Best of 10',
    description: '10 Runden\nMit Leaderboard',
    color: '#c4a35a'
  }
];

const GameModeSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { playerNames } = route.params;
  const canHaveSaboteur = playerNames.length >= 5;

  const splitNamesIntoColumns = () => {
    const midPoint = Math.ceil(playerNames.length / 2);
    const firstColumn = playerNames.slice(0, midPoint);
    const secondColumn = playerNames.slice(midPoint);
    return { firstColumn, secondColumn };
  };

  const { firstColumn, secondColumn } = splitNamesIntoColumns();

  const handleGameModeSelect = (gameMode: GameMode) => {
    if (!canHaveSaboteur) {
      const gameConfig = createGameConfig(playerNames, gameMode, 0);
      navigation.navigate('RoleReveal', { gameConfig });
    } else {
      navigation.navigate('SaboteurModeSetup', { playerNames, gameMode });
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Spielmodus auswählen</Text>
        
        <View style={styles.playerList}>
          <Text style={styles.playerListTitle}>Spieler ({playerNames.length}):</Text>
          <View style={styles.playerColumns}>
            <View style={styles.column}>
              {firstColumn.map((name, index) => (
                <Text key={index} style={styles.playerName}>• {name}</Text>
              ))}
            </View>
            {secondColumn.length > 0 && (
              <View style={styles.column}>
                {secondColumn.map((name, index) => (
                  <Text key={index + firstColumn.length} style={styles.playerName}>• {name}</Text>
                ))}
              </View>
            )}
          </View>
          {!canHaveSaboteur && (
            <Text style={styles.saboteurHint}>
              Hinweis: Saboteur-Modus erst ab 5 Spielern verfügbar
            </Text>
          )}
        </View>

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Wähle einen Spielmodus</Text>
          
          <View style={styles.cardsGrid}>
            {gameModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeCard, { backgroundColor: mode.color }]}
                onPress={() => handleGameModeSelect(mode.gameMode)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{mode.icon}</Text>
                  <Text style={styles.cardTitle}>{mode.title}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardDescription}>{mode.description}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHint}>Tippe zum Auswählen</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              • Eine Runde: Einzelnes Spiel ohne Leaderboard{'\n'}
              • Best of X: Mehrere Runden mit Leaderboard nach jeder Runde
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#e5e5dc',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 30,
  },
  playerList: {
    backgroundColor: '#26495c',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  playerListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 10,
  },
  playerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    color: '#e5e5dc',
    marginBottom: 5,
  },
  saboteurHint: {
    fontSize: 14,
    color: '#c4a35a',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  modeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsGrid: {
    gap: 15,
    marginBottom: 20,
  },
  // Mode Card Styles
  modeCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e5e5dc',
    flex: 1,
  },
  cardBody: {
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#e5e5dc',
    lineHeight: 18,
    textAlign: 'center',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 8,
  },
  cardHint: {
    fontSize: 12,
    color: '#e5e5dc',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  // Info Container
  infoContainer: {
    backgroundColor: '#26495c',
    padding: 15,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#e5e5dc',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default GameModeSetupScreen;