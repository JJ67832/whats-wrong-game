// adults/src/screens/PartyLeaderboardScreen.tsx - VOLLSTÄNDIG AKTUALISIERT
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AdultsGameConfig, ADULTS_COLORS, GameMode } from '../types';
import { rotateRolesForNextRound, getRoleStatistics, getDrinkingStatistics } from '../utils/roleRotation';
import Button from '../components/Button';

type RootStackParamList = {
  PartyLeaderboard: { gameConfig: AdultsGameConfig; detectiveWon: boolean };
  PartyRoleReveal: { gameConfig: AdultsGameConfig };
  PartyGame: { gameConfig: AdultsGameConfig };
  PartyHome: undefined;
  MainMenu: undefined;
};

type PartyLeaderboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PartyLeaderboard'>;
type PartyLeaderboardScreenRouteProp = RouteProp<RootStackParamList, 'PartyLeaderboard'>;

interface Props {
  navigation: PartyLeaderboardScreenNavigationProp;
  route: PartyLeaderboardScreenRouteProp;
}

// 🛡️ SICHERE KONVERTIERUNGSFUNKTION
const ensureAdultsGameConfig = (config: any): AdultsGameConfig => {
  const safeConfig: AdultsGameConfig = {
    players: Array.isArray(config.players) ? config.players.map((player: any) => ({
      id: player.id || '',
      name: player.name || 'Unbekannter Spieler',
      role: player.role || 'civilian',
      instruction: player.instruction || '',
      drinks: typeof player.drinks === 'number' ? player.drinks : 0,
      chaosRuleViolations: typeof player.chaosRuleViolations === 'number' ? player.chaosRuleViolations : 0,
      hasBeenDetective: player.hasBeenDetective || false,
      detectiveCount: typeof player.detectiveCount === 'number' ? player.detectiveCount : 0,
      lastRole: player.lastRole || 'civilian'
    })) : [],
    detective: config.detective || { id: '', name: 'Unbekannt', role: 'civilian', instruction: '', drinks: 0, chaosRuleViolations: 0 },
    instruction: config.instruction || '',
    gameMode: config.gameMode || 'single',
    currentRound: typeof config.currentRound === 'number' ? config.currentRound : 1,
    totalRounds: typeof config.totalRounds === 'number' ? config.totalRounds : 1,
    playerScores: Array.isArray(config.playerScores) ? config.playerScores.map((score: any) => ({
      playerId: score.playerId || '',
      playerName: score.playerName || 'Unbekannt',
      score: typeof score.score === 'number' ? score.score : 0,
      drinks: typeof score.drinks === 'number' ? score.drinks : 0
    })) : [],
    saboteurCount: typeof config.saboteurCount === 'number' ? config.saboteurCount : 0,
    activeChaosRules: Array.isArray(config.activeChaosRules) ? config.activeChaosRules : [],
    totalDrinks: typeof config.totalDrinks === 'number' ? config.totalDrinks : 0,
    usedDetectives: Array.isArray(config.usedDetectives) ? config.usedDetectives : [],
    roleRotationEnabled: config.roleRotationEnabled || false,
    nextDetectiveIndex: typeof config.nextDetectiveIndex === 'number' ? config.nextDetectiveIndex : -1
  };
  
  return safeConfig;
};

const PartyLeaderboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialGameConfig = ensureAdultsGameConfig(route.params.gameConfig);
  const { detectiveWon } = route.params;
  
  const [gameConfig, setGameConfig] = useState<AdultsGameConfig>(initialGameConfig);
  const [roleStatistics, setRoleStatistics] = useState(getRoleStatistics(initialGameConfig));
  const [drinkingStats, setDrinkingStats] = useState(getDrinkingStatistics(initialGameConfig));
  const [showRotationInfo, setShowRotationInfo] = useState(false);

  useEffect(() => {
    const stats = getRoleStatistics(gameConfig);
    const drinkStats = getDrinkingStatistics(gameConfig);
    setRoleStatistics(stats);
    setDrinkingStats(drinkStats);
  }, [gameConfig]);

  const isFinalRound = gameConfig.currentRound >= gameConfig.totalRounds;
  const isMultiRound = gameConfig.gameMode !== 'single';

  const handleNextRound = () => {
    if (isFinalRound) {
      Alert.alert(
        '🎉 SPIEL BEENDET',
        `Das ${gameConfig.gameMode.toUpperCase()} ist vorbei!\n\nFinale Statistiken:\n• ${drinkingStats.totalDrinks} Getränke konsumiert\n• ${roleStatistics.chaosRuleActivations} Chaos-Regeln aktiv\n• ${drinkingStats.mostDrinksPlayer} hat am meisten getrunken (${drinkingStats.mostDrinksCount})`,
        [
          { text: 'Neues Spiel', onPress: () => navigation.navigate('PartyHome') },
          { text: 'Hauptmenü', onPress: () => navigation.navigate('MainMenu') }
        ]
      );
      return;
    }

    // 🎯 ROLLEN-ROTATION DURCHFÜHREN
    const rotatedConfig = rotateRolesForNextRound(gameConfig);
    setGameConfig(rotatedConfig);
    
    // Zeige Rotations-Info
    setShowRotationInfo(true);
    
    Alert.alert(
      '🔄 ROLLEN WECHSELN',
      `Neuer Detektiv für Runde ${rotatedConfig.currentRound}: ${rotatedConfig.detective.name}\n\n🎯 ${rotatedConfig.detective.name} war bereits ${rotatedConfig.detective.detectiveCount || 1}x Detektiv\n🍻 Hat bisher ${rotatedConfig.detective.drinks} Getränke konsumiert`,
      [
        { 
          text: 'Weiter zur Rollen-Enthüllung', 
          onPress: () => {
            setShowRotationInfo(false);
            navigation.navigate('PartyRoleReveal', { gameConfig: rotatedConfig });
          }
        }
      ]
    );
  };

  const handleBackToGame = () => {
    navigation.navigate('PartyGame', { gameConfig });
  };

  const handleNewGame = () => {
    navigation.navigate('PartyHome');
  };

  const handleMainMenu = () => {
    navigation.navigate('MainMenu');
  };

  const sortedScores = [...gameConfig.playerScores].sort((a, b) => b.score - a.score);
  const winner = sortedScores[0];

  const renderRotationInfo = () => {
    if (!showRotationInfo) return null;

    const nextDetectiveIndex = gameConfig.nextDetectiveIndex !== undefined && gameConfig.nextDetectiveIndex !== -1 
      ? gameConfig.nextDetectiveIndex 
      : (gameConfig.usedDetectives?.length || 0) % gameConfig.players.length;
    
    const nextDetective = gameConfig.players[nextDetectiveIndex];

    return (
      <View style={styles.rotationInfo}>
        <Text style={styles.rotationTitle}>🔄 NÄCHSTE RUNDE - RUNDE {gameConfig.currentRound + 1}</Text>
        <View style={styles.nextDetectiveCard}>
          <Text style={styles.nextDetectiveIcon}>🔍</Text>
          <Text style={styles.nextDetectiveName}>{nextDetective?.name || 'Wird ausgelost...'}</Text>
          <Text style={styles.nextDetectiveStats}>
            🎯 Detektiv: {nextDetective?.detectiveCount || 0}x | 🍻 Getränke: {nextDetective?.drinks || 0}
          </Text>
        </View>
        <Text style={styles.rotationHint}>
          Die Rollen werden automatisch rotiert für maximale Fairness!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isFinalRound ? '🎉 FINALE RANGLISTE' : '📊 RUNDE ' + gameConfig.currentRound}
      </Text>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        {/* ERGEBNIS ANZEIGE */}
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>
            {detectiveWon ? '🔍 DETEKTIV GEWINNT!' : '🎭 PARTY-AKTEURE GEWINNEN!'}
          </Text>
          <Text style={styles.resultDescription}>
            {detectiveWon 
              ? `${gameConfig.detective.name} hat die Anweisung erraten!`
              : `Die Party-Akteure haben ${gameConfig.detective.name} getäuscht!`
            }
          </Text>
        </View>

        {/* ROTATIONS-INFO */}
        {isMultiRound && renderRotationInfo()}

        {/* RANGLISTE */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>🏆 RANGLISTE</Text>
          {sortedScores.map((player, index) => (
            <View 
              key={player.playerId} 
              style={[
                styles.playerRow,
                index === 0 && styles.winnerRow,
                player.playerId === gameConfig.detective.id && styles.detectiveRow
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>
                  {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>
                  {player.playerName} 
                  {player.playerId === gameConfig.detective.id && ' 🔍'}
                </Text>
                <Text style={styles.playerDetails}>
                  🎯 {player.score} Punkte | 🍻 {player.drinks} Getränke
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* TRINK-STATISTIKEN */}
        <View style={styles.drinkingStatsSection}>
          <Text style={styles.sectionTitle}>🍻 TRINK-STATISTIKEN</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{drinkingStats.totalDrinks}</Text>
              <Text style={styles.statLabel}>Gesamt Getränke</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{drinkingStats.shots}</Text>
              <Text style={styles.statLabel}>Shots</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{drinkingStats.sips}</Text>
              <Text style={styles.statLabel}>Schlucke</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{drinkingStats.socialDrinks}</Text>
              <Text style={styles.statLabel}>Soziale Runden</Text>
            </View>
          </View>
          <View style={styles.mostDrinks}>
            <Text style={styles.mostDrinksText}>
              🏆 {drinkingStats.mostDrinksPlayer}: {drinkingStats.mostDrinksCount} Getränke
            </Text>
          </View>
        </View>

        {/* DETEKTIV-ROTATION */}
        {isMultiRound && (
          <View style={styles.rotationSection}>
            <Text style={styles.sectionTitle}>🔄 DETEKTIV-ROTATION</Text>
            <View style={styles.rotationList}>
              {roleStatistics.detectiveRotation.map((rotation, index) => (
                <View key={index} style={styles.rotationItem}>
                  <Text style={styles.rotationRound}>Runde {rotation.round}</Text>
                  <Text style={styles.rotationDetective}>{rotation.detectiveName}</Text>
                  <Text style={styles.rotationStats}>
                    🍻 {rotation.drinksConsumed} | ⚠️ {rotation.chaosViolations}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CHAOS-REGELN */}
        <View style={styles.chaosSection}>
          <Text style={styles.sectionTitle}>🎭 AKTIVE CHAOS-REGELN</Text>
          <Text style={styles.chaosCount}>
            {gameConfig.activeChaosRules.length} Regeln aktiv
          </Text>
          {gameConfig.activeChaosRules.map((rule, index) => (
            <Text key={index} style={styles.chaosRule}>
              • {rule.name}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        {isMultiRound && !isFinalRound && (
          <Button
            title={`🎯 RUNDE ${gameConfig.currentRound + 1} STARTEN`}
            onPress={handleNextRound}
            color={ADULTS_COLORS.danger}
            size="large"
          />
        )}
        
        {isFinalRound && (
          <>
            <Button
              title="🎉 NEUES SPIEL"
              onPress={handleNewGame}
              color={ADULTS_COLORS.success}
              size="large"
            />
            <Button
              title="🏠 HAUPTMENÜ"
              onPress={handleMainMenu}
              color={ADULTS_COLORS.primary}
              size="medium"
            />
          </>
        )}
        
        <Button
          title="🔙 ZURÜCK ZUM SPIEL"
          onPress={handleBackToGame}
          color={ADULTS_COLORS.warning}
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
    backgroundColor: ADULTS_COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    lineHeight: 20,
  },
  rotationInfo: {
    backgroundColor: ADULTS_COLORS.warning,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  rotationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  nextDetectiveCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextDetectiveIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  nextDetectiveName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  nextDetectiveStats: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
  },
  rotationHint: {
    fontSize: 12,
    color: ADULTS_COLORS.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  leaderboardSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 15,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  winnerRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 5,
  },
  detectiveRow: {
    borderLeftWidth: 4,
    borderLeftColor: ADULTS_COLORS.warning,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 4,
  },
  playerDetails: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    opacity: 0.8,
  },
  drinkingStatsSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
  },
  mostDrinks: {
    backgroundColor: ADULTS_COLORS.danger,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  mostDrinksText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
  },
  rotationSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  rotationList: {
    gap: 8,
  },
  rotationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  rotationRound: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    width: 80,
  },
  rotationDetective: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    flex: 1,
  },
  rotationStats: {
    fontSize: 12,
    color: ADULTS_COLORS.warning,
    width: 100,
    textAlign: 'right',
  },
  chaosSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  chaosCount: {
    fontSize: 16,
    color: ADULTS_COLORS.warning,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chaosRule: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 10,
  },
});

export default PartyLeaderboardScreen;