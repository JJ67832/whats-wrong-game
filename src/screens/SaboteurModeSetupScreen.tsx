import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig, GameMode, Player } from '../types';
import { getRandomInstruction } from '../utils/instructions';
import Button from '../components/Button';
import { initializeRoles } from '../utils/roleRotation'; // 🆕 IMPORT: Rollen-Rotation

type RootStackParamList = {
  SaboteurModeSetup: { playerNames: string[]; gameMode: GameMode };
  RoleReveal: { gameConfig: GameConfig };
};

type SaboteurModeSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SaboteurModeSetup'>;
type SaboteurModeSetupScreenRouteProp = RouteProp<RootStackParamList, 'SaboteurModeSetup'>;

interface Props {
  navigation: SaboteurModeSetupScreenNavigationProp;
  route: SaboteurModeSetupScreenRouteProp;
}

const SaboteurModeSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { playerNames, gameMode } = route.params;
  const [saboteurCount, setSaboteurCount] = useState(0);

  const maxSaboteurs = Math.floor(playerNames.length / 3);
  const canHaveSaboteur = playerNames.length >= 5;

  useEffect(() => {
    if (!canHaveSaboteur) {
      const gameConfig = createGameConfig(0);
      navigation.navigate('RoleReveal', { gameConfig });
    }
  }, [canHaveSaboteur, navigation]);

  const updateSaboteurCount = (count: number) => {
    if (count < 0) return;
    if (count > maxSaboteurs) {
      Alert.alert('Info', `Bei ${playerNames.length} Spielern können maximal ${maxSaboteurs} Saboteure ausgewählt werden.`);
      return;
    }
    setSaboteurCount(count);
  };

  // 🆕 AKTUALISIERT: Verwendet initializeRoles für Rollen-Rotation
  const createGameConfig = (saboteurCount: number): GameConfig => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: name,
      role: 'actor', // Wird in initializeRoles korrigiert
      instruction: '' // Wird in initializeRoles gesetzt
    }));

    const instruction = getRandomInstruction();
    
    // 🆕 VERWENDET ROLLEN-ROTATION UTILITY
    return initializeRoles(players, instruction, gameMode, saboteurCount);
  };

  const handleContinue = () => {
    const gameConfig = createGameConfig(saboteurCount);
    navigation.navigate('RoleReveal', { gameConfig });
  };

  const isMaxSaboteurs = saboteurCount >= maxSaboteurs;

  if (!canHaveSaboteur) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spiel wird vorbereitet...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Saboteur-Modus</Text>
        
        {/* 🆕 NEU: Info über Rollen-Rotation */}
        {gameMode !== 'single' && (
          <View style={styles.rotationInfo}>
            <Text style={styles.rotationTitle}>🎯 Rollen-Rotation aktiv</Text>
            <Text style={styles.rotationText}>
              In Mehrrunden-Spielen wechselt der Detektiv jede Runde zufällig!
            </Text>
          </View>
        )}
        
        <View style={styles.playerList}>
          <Text style={styles.playerListTitle}>Spieler ({playerNames.length}):</Text>
          <View style={styles.playerNamesContainer}>
            {playerNames.map((name, index) => (
              <Text key={index} style={styles.playerName}>• {name}</Text>
            ))}
          </View>
        </View>

        <View style={styles.saboteurSection}>
          <Text style={styles.sectionTitle}>Saboteur aktivieren?</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchButtons}>
              <View style={styles.smallButtonWrapper}>
                <Button 
                  title="Ohne Saboteur" 
                  onPress={() => setSaboteurCount(0)}
                  color={saboteurCount === 0 ? "#c66b3d" : "#26495c"}
                  size="small"
                />
              </View>
              <View style={styles.smallButtonWrapper}>
                <Button 
                  title="Mit Saboteur" 
                  onPress={() => updateSaboteurCount(1)}
                  color={saboteurCount > 0 ? "#c66b3d" : "#26495c"}
                  size="small"
                />
              </View>
            </View>
          </View>
          
          {saboteurCount > 0 && (
            <View style={styles.counterSection}>
              <Text style={styles.sectionTitle}>Anzahl Saboteure (max {maxSaboteurs})</Text>
              <View style={styles.counterContainer}>
                <Button 
                  title="-"
                  onPress={() => updateSaboteurCount(saboteurCount - 1)}
                  color="#c66b3d"
                  size="small"
                />
                <Text style={styles.counterText}>{saboteurCount}</Text>
                <Button 
                  title="+"
                  onPress={() => updateSaboteurCount(saboteurCount + 1)}
                  color="#c66b3d"
                  size="small"
                  disabled={isMaxSaboteurs}
                />
              </View>
              {isMaxSaboteurs && (
                <Text style={styles.maxWarning}>
                  Maximale Anzahl an Saboteuren erreicht
                </Text>
              )}
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {saboteurCount === 0 
                ? "Klassischer Modus: Nur Detektiv vs. Akteure" + 
                  (gameMode !== 'single' ? "\n• Rollen wechseln jede Runde" : "")
                : `Saboteur-Modus: ${saboteurCount} Saboteur(en) arbeiten heimlich mit dem Detektiv` + 
                  (gameMode !== 'single' ? "\n• Rollen wechseln jede Runde (Saboteure bleiben)" : "")
              }
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Spiel starten"
            onPress={handleContinue}
            color="#c66b3d"
            size="large"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5e5dc',
    minHeight: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 20, // 🆕 Reduziert für Rotations-Info
  },
  // 🆕 NEU: Rollen-Rotation Info
  rotationInfo: {
    backgroundColor: '#c4a35a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  rotationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 5,
    textAlign: 'center',
  },
  rotationText: {
    fontSize: 14,
    color: '#26495c',
    textAlign: 'center',
    lineHeight: 18,
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
  playerNamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerName: {
    fontSize: 16,
    color: '#e5e5dc',
    marginBottom: 5,
    marginRight: 15,
    flexShrink: 1,
  },
  saboteurSection: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 20,
    textAlign: 'center',
  },
  switchContainer: {
    marginBottom: 30,
  },
  switchButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
  },
  smallButtonWrapper: {
    width: '48%',
  },
  counterSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#26495c',
    minWidth: 40,
    textAlign: 'center',
  },
  maxWarning: {
    color: '#c66b3d',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#26495c',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#e5e5dc',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
});

export default SaboteurModeSetupScreen;