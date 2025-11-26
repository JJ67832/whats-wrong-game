// adults/src/screens/PartyGameModeSetupScreen.tsx - VOLLSTÄNDIG AKTUALISIERT
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameMode, ADULTS_COLORS } from '../types';

type RootStackParamList = {
  PartyGameModeSetup: { playerNames: string[] };
  PartyChaosRuleSelection: { playerNames: string[]; gameMode: string };
};

type PartyGameModeSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PartyGameModeSetup'>;
type PartyGameModeSetupScreenRouteProp = RouteProp<RootStackParamList, 'PartyGameModeSetup'>;

interface Props {
  navigation: PartyGameModeSetupScreenNavigationProp;
  route: PartyGameModeSetupScreenRouteProp;
}

const gameModes = [
  {
    id: 'single',
    gameMode: 'single' as GameMode,
    icon: '🎯',
    title: 'EINE RUNDE',
    description: 'Einzelnes Chaos-Spiel\nPerfekt für schnelle Partys\n❌ Keine Rollen-Rotation',
    color: ADULTS_COLORS.danger,
    rotationInfo: 'Keine Rotation'
  },
  {
    id: 'bo3',
    gameMode: 'bo3' as GameMode,
    icon: '🥃',
    title: 'BEST OF 3',
    description: '3 Runden Chaos\nMit Trink-Statistiken\n🔄 Automatische Rollen-Rotation',
    color: ADULTS_COLORS.primary,
    rotationInfo: 'Rollen wechseln jede Runde'
  },
  {
    id: 'bo5',
    gameMode: 'bo5' as GameMode,
    icon: '🍻',
    title: 'BEST OF 5',
    description: '5 Runden Extrem-Chaos\nNur für harte Partys!\n🔄 Faire Rollen-Verteilung',
    color: ADULTS_COLORS.warning,
    rotationInfo: 'Optimierte Rotation'
  },
];

const PartyGameModeSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { playerNames } = route.params;
  const [selectedMode, setSelectedMode] = useState<GameMode>('single');

  const splitNamesIntoColumns = () => {
    const midPoint = Math.ceil(playerNames.length / 2);
    const firstColumn = playerNames.slice(0, midPoint);
    const secondColumn = playerNames.slice(midPoint);
    return { firstColumn, secondColumn };
  };

  const { firstColumn, secondColumn } = splitNamesIntoColumns();

  const handleGameModeSelect = (gameMode: GameMode) => {
    setSelectedMode(gameMode);
  };

  const handleStartGame = () => {
    navigation.navigate('PartyChaosRuleSelection', { 
      playerNames: playerNames,
      gameMode: selectedMode 
    });
  };

  const getRotationInfo = () => {
    if (selectedMode === 'single') {
      return {
        title: '🎯 EINZEL-RUNDE',
        description: 'Alle bleiben in ihren Rollen\nPerfekt für schnelle Partys',
        icon: '🎯'
      };
    } else if (selectedMode === 'bo3') {
      return {
        title: '🔄 ROLLEN-ROTATION AKTIV',
        description: `Rollen wechseln nach jeder Runde\n${playerNames.length} Spieler → 3 Runden\nFaire Verteilung garantiert!`,
        icon: '🔄'
      };
    } else {
      return {
        title: '🎪 EXTREME ROTATION',
        description: `Optimierte Rollen-Verteilung\n${playerNames.length} Spieler → 5 Runden\nJeder wird mehrmals Detektiv!`,
        icon: '🎪'
      };
    }
  };

  const rotationInfo = getRotationInfo();

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎲 PARTY-MODUS AUSWÄHLEN 🎲</Text>
        
        <View style={styles.playerList}>
          <Text style={styles.playerListTitle}>Party-Crew ({playerNames.length}):</Text>
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

        <View style={styles.rotationInfoSection}>
          <View style={styles.rotationHeader}>
            <Text style={styles.rotationIcon}>{rotationInfo.icon}</Text>
            <Text style={styles.rotationTitle}>{rotationInfo.title}</Text>
          </View>
          <Text style={styles.rotationDescription}>{rotationInfo.description}</Text>
          
          {selectedMode !== 'single' && (
            <View style={styles.rotationDetails}>
              <Text style={styles.rotationDetailsText}>
                🎯 Detektiv-Rotation: {selectedMode === 'bo3' ? '3 Runden' : '5 Runden'}
              </Text>
              <Text style={styles.rotationDetailsText}>
                🍻 Trink-Statistiken werden mitgeführt
              </Text>
              <Text style={styles.rotationDetailsText}>
                🎭 Chaos-Regeln bleiben aktiv
              </Text>
            </View>
          )}
        </View>

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>WÄHLE DEINEN PARTY-MODUS</Text>
          
          <View style={styles.cardsGrid}>
            {gameModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard, 
                  { 
                    backgroundColor: selectedMode === mode.gameMode ? mode.color : ADULTS_COLORS.primary,
                    borderColor: ADULTS_COLORS.accent
                  }
                ]}
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
                  <Text style={styles.rotationInfo}>{mode.rotationInfo}</Text>
                  <Text style={styles.cardHint}>
                    {selectedMode === mode.gameMode ? '✅ AUSGEWÄHLT' : 'Tippe zum Auswählen'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chaosInfo}>
          <Text style={styles.chaosInfoTitle}>🎪 CHAOS-REGELN SYSTEM</Text>
          <Text style={styles.chaosInfoText}>
            Im nächsten Schritt kannst du bis zu 6 Chaos-Regeln auswählen!{'\n'}
            Diese Regeln sorgen für zusätzlichen Spaß und Trink-Herausforderungen.
            {'\n\n'}🎯 <Text style={styles.highlightText}>Rollen-Rotation inklusive!</Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.chaosButton, { backgroundColor: ADULTS_COLORS.danger }]}
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <Text style={styles.chaosButtonText}>
              {selectedMode === 'single' ? 'CHAOS-REGELN AUSWÄHLEN!' : 'ROLLEN-ROTATION STARTEN!'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: ADULTS_COLORS.background,
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
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  playerList: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  playerListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 10,
    textAlign: 'center',
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
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  rotationInfoSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.warning,
  },
  rotationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rotationIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  rotationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    flex: 1,
  },
  rotationDescription: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    lineHeight: 18,
    marginBottom: 10,
  },
  rotationDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  rotationDetailsText: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    marginBottom: 3,
  },
  modeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardsGrid: {
    gap: 15,
    marginBottom: 20,
  },
  modeCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    color: ADULTS_COLORS.accent,
    flex: 1,
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardBody: {
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 8,
  },
  rotationInfo: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardHint: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  chaosInfo: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  chaosInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    textAlign: 'center',
    marginBottom: 10,
  },
  chaosInfoText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    lineHeight: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  chaosButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chaosButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
  },
  highlightText: {
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
  },
});

export default PartyGameModeSetupScreen;