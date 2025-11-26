import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameMode, Player, GameConfig } from '../types';
import { getRandomInstruction } from '../utils/instructions';
import Button from '../components/Button';
import { initializeRoles } from '../utils/roleRotation'; // � IMPORT: Rollen-Rotation

type RootStackParamList = {
  KidsHome: undefined;
  KidsPlayerNameSetup: undefined;
  KidsGameModeSetup: { playerNames: string[] };
  KidsRoleReveal: { gameConfig: GameConfig };
};

type KidsGameModeSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsGameModeSetup'>;
type KidsGameModeSetupScreenRouteProp = RouteProp<RootStackParamList, 'KidsGameModeSetup'>;

interface Props {
  navigation: KidsGameModeSetupScreenNavigationProp;
  route: KidsGameModeSetupScreenRouteProp;
}

// 🆕 AKTUALISIERT: Verwendet initializeRoles für Rollen-Rotation
const createGameConfig = (playerNames: string[], gameMode: GameMode): GameConfig => {
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index}-${Date.now()}`,
    name: name,
    role: 'actor', // Wird in initializeRoles korrigiert
    instruction: '' // Wird in initializeRoles gesetzt
  }));

  const instruction = getRandomInstruction();
  
  // 🆕 VERWENDET ROLLEN-ROTATION UTILITY
  return initializeRoles(players, instruction, gameMode);
};

// Vereinfachte Spielmodi für Kids
const gameModes = [
  {
    id: 'single',
    gameMode: 'single' as GameMode,
    icon: '🎯',
    title: 'Einmal spielen',
    description: 'Eine Runde Spielspaß',
    color: '#ffd166'
  },
  {
    id: 'bo3',
    gameMode: 'bo3' as GameMode,
    icon: '🥉',
    title: 'Best of 3',
    description: 'Drei Runden mit Punkten',
    color: '#06d6a0'
  },
  {
    id: 'bo5',
    gameMode: 'bo5' as GameMode,
    icon: '🏆',
    title: 'Best of 5',
    description: 'Fünf Runden Champion',
    color: '#4a90e2'
  }
];

const KidsGameModeSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { playerNames } = route.params;

  const splitNamesIntoColumns = () => {
    const midPoint = Math.ceil(playerNames.length / 2);
    const firstColumn = playerNames.slice(0, midPoint);
    const secondColumn = playerNames.slice(midPoint);
    return { firstColumn, secondColumn };
  };

  const { firstColumn, secondColumn } = splitNamesIntoColumns();

  const handleGameModeSelect = (gameMode: GameMode) => {
    const gameConfig = createGameConfig(playerNames, gameMode);
    navigation.navigate('KidsRoleReveal', { gameConfig });
  };

  // 🆕 NEU: Info über Rollen-Rotation für Mehrrunden-Spiele
  const getModeDescription = (mode: typeof gameModes[0]) => {
    if (mode.gameMode === 'single') {
      return mode.description;
    }
    return `${mode.description}\n(Rollen wechseln jede Runde)`;
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welches Spiel? 🎮</Text>
        
        <View style={styles.playerList}>
          <Text style={styles.playerListTitle}>Deine Freunde ({playerNames.length}):</Text>
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
        </View>

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Wähle dein Spiel</Text>
          
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
                  <Text style={styles.cardDescription}>
                    {getModeDescription(mode)}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHint}>Tippe hier!</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 🆕 AKTUALISIERT: Bessere Info über Rollen-Rotation */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>So funktioniert's:</Text>
            <Text style={styles.infoText}>
              • Einmal spielen: Schneller Spaß{'\n'}
              • Best of X: Mehrere Runden mit Punkten{'\n'}
              • 🔍 Jeder wird mal Detektiv!{'\n'}
              • 🎯 Rollen wechseln automatisch
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
    backgroundColor: '#e8f4f8',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
  },
  playerList: {
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  playerListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd166',
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
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 5,
  },
  modeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsGrid: {
    gap: 20,
    marginBottom: 20,
  },
  modeCard: {
    borderRadius: 25,
    padding: 25,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  cardBody: {
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 20,
    textAlign: 'center',
  },
  cardFooter: {
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    paddingTop: 8,
  },
  cardHint: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
  },
  infoContainer: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default KidsGameModeSetupScreen;