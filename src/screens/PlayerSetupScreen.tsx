import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Player, GameConfig, GameMode } from '../types';
import { getRandomInstruction } from '../utils/instructions';
import Button from '../components/Button';

type RootStackParamList = {
  Home: undefined;
  PlayerSetup: { existingGameConfig?: GameConfig };
  RoleReveal: { gameConfig: GameConfig };
  Game: { gameConfig: GameConfig };
  Leaderboard: { gameConfig: GameConfig; detectiveWon: boolean };
};

type PlayerSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlayerSetup'>;
type PlayerSetupScreenRouteProp = RouteProp<RootStackParamList, 'PlayerSetup'>;

interface Props {
  navigation: PlayerSetupScreenNavigationProp;
  route: PlayerSetupScreenRouteProp;
}

const PlayerSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const existingGameConfig = route.params?.existingGameConfig;
  
  const [playerCount, setPlayerCount] = useState(existingGameConfig?.players.length || 3);
  const [playerNames, setPlayerNames] = useState<string[]>(
    existingGameConfig ? existingGameConfig.players.map(p => p.name) : ['', '', '']
  );
  const [gameMode, setGameMode] = useState<GameMode>(existingGameConfig?.gameMode || 'single');

  const updatePlayerCount = (count: number) => {
    if (count < 2) return;
    if (count > 12) {
      Alert.alert('Info', 'Maximal 12 Spieler können mitspielen');
      return;
    }
    
    setPlayerCount(count);
    const newNames = [...playerNames];
    while (newNames.length < count) newNames.push('');
    while (newNames.length > count) newNames.pop();
    setPlayerNames(newNames);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  // Prüft auf doppelte Namen
  const hasDuplicateNames = (): boolean => {
    const trimmedNames = playerNames.map(name => name.trim().toLowerCase());
    const uniqueNames = new Set(trimmedNames);
    return uniqueNames.size !== trimmedNames.length;
  };

  const assignRoles = (playerNames: string[]): GameConfig => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: name.trim(),
      role: 'actor',
      instruction: ''
    }));

    // Wähle zufälligen Detektiv
    const detectiveIndex = Math.floor(Math.random() * players.length);
    const detective = {
      ...players[detectiveIndex],
      role: 'detective' as const
    };
    players[detectiveIndex] = detective;

    // Weise allen Actors die gleiche Anweisung zu
    const instruction = getRandomInstruction();
    players.forEach(player => {
      if (player.role === 'actor') {
        player.instruction = instruction;
      }
    });

    // Bestimme Rundenanzahl basierend auf Spielmodus
    const totalRounds = gameMode === 'single' ? 1 : 
                       gameMode === 'bo3' ? 3 : 
                       gameMode === 'bo5' ? 5 : 7;

    // Initialisiere oder verwende bestehende Scores
    const playerScores = existingGameConfig?.playerScores || 
      players.map(player => ({
        playerId: player.id,
        playerName: player.name,
        score: 0
      }));

    return {
      players,
      detective,
      instruction,
      gameMode,
      currentRound: existingGameConfig ? existingGameConfig.currentRound : 1,
      totalRounds,
      playerScores,
      saboteurCount: existingGameConfig?.saboteurCount || 0 // Übernehme vorhandenen Saboteur-Count oder 0
    };
  };

  const canStart = playerNames.every(name => name.trim().length > 0) && 
                  playerNames.length >= 2 && 
                  !hasDuplicateNames();

  const handleContinue = () => {
    if (hasDuplicateNames()) {
      Alert.alert('Fehler', 'Spielernamen müssen eindeutig sein! Bitte verwende unterschiedliche Namen.');
      return;
    }

    if (canStart) {
      const gameConfig = assignRoles(playerNames);
      navigation.navigate('RoleReveal', { gameConfig });
    } else {
      Alert.alert('Fehler', 'Bitte gib für alle Spieler einen eindeutigen Namen ein (mindestens 2 Spieler)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiel einrichten</Text>

      {/* SPIELMODUS AUSWAHL */}
      <View style={styles.modeSection}>
        <Text style={styles.sectionTitle}>Spielmodus</Text>
        <View style={styles.modeButtons}>
          <Button 
            title="Eine Runde" 
            onPress={() => setGameMode('single')}
            color={gameMode === 'single' ? "#c66b3d" : "#26495c"}
            size="small"
          />
          <Button 
            title="Best of 3" 
            onPress={() => setGameMode('bo3')}
            color={gameMode === 'bo3' ? "#c66b3d" : "#26495c"}
            size="small"
          />
          <Button 
            title="Best of 5" 
            onPress={() => setGameMode('bo5')}
            color={gameMode === 'bo5' ? "#c66b3d" : "#26495c"}
            size="small"
          />
          <Button 
            title="Best of 7" 
            onPress={() => setGameMode('bo7')}
            color={gameMode === 'bo7' ? "#c66b3d" : "#26495c"}
            size="small"
          />
        </View>
        <Text style={styles.modeDescription}>
          {gameMode === 'single' ? 'Eine Runde - Kein Leaderboard' : 
           `${gameMode.toUpperCase()} - Leaderboard nach jeder Runde`}
        </Text>
      </View>

      <View style={styles.counterSection}>
        <Text style={styles.sectionTitle}>Spieleranzahl (2-12)</Text>
        <View style={styles.counterContainer}>
          <Button 
            title="-"
            onPress={() => updatePlayerCount(playerCount - 1)}
            color="#c66b3d"
            size="small"
          />
          <Text style={styles.counterText}>{playerCount}</Text>
          <Button 
            title="+"
            onPress={() => updatePlayerCount(playerCount + 1)}
            color="#c66b3d"
            size="small"
          />
        </View>
      </View>

      <View style={styles.namesSection}>
        <Text style={styles.sectionTitle}>Spielernamen</Text>
        {hasDuplicateNames() && (
          <Text style={styles.duplicateWarning}>⚠️ Namen müssen eindeutig sein!</Text>
        )}
        <ScrollView style={styles.namesContainer}>
          {playerNames.map((name, index) => (
            <View key={index}>
              <TextInput
                style={[
                  styles.input,
                  playerNames.some((n, i) => i !== index && n.trim().toLowerCase() === name.trim().toLowerCase()) && 
                  styles.duplicateInput
                ]}
                placeholder={`Spieler ${index + 1}`}
                value={name}
                onChangeText={(text) => updatePlayerName(index, text)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={existingGameConfig ? "Nächste Runde starten" : "Rollen verteilen"}
          onPress={handleContinue}
          disabled={!canStart}
          color="#c66b3d"
          size="large"
        />
        
        <Button 
          title="Zurück zum Menü"
          onPress={() => navigation.navigate('Home')}
          color="#26495c"
          size="medium"
        />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 30,
  },
  modeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 15,
    textAlign: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modeDescription: {
    fontSize: 14,
    color: '#26495c',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  counterSection: {
    marginBottom: 30,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#26495c',
    minWidth: 40,
    textAlign: 'center',
  },
  namesSection: {
    flex: 1,
    marginBottom: 20,
  },
  duplicateWarning: {
    color: '#c66b3d',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  namesContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c4a35a',
    fontSize: 16,
    color: '#26495c',
  },
  duplicateInput: {
    borderColor: '#c66b3d',
    backgroundColor: '#fff0f0',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
});

export default PlayerSetupScreen;