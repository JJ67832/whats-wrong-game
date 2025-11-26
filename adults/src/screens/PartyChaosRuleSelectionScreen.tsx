// adults/src/screens/PartyChaosRuleSelectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { 
  AdultsGameConfig, 
  AdultsPlayer, 
  AdultsRole,
  PlayerScore, 
  ADULTS_COLORS, 
  ChaosRule,
  GameMode 
} from '../types';
import { CHAOS_RULES, getChaosRulesByCategory, getRandomChaosRules } from '../utils/chaosRules';
import { getRandomInstruction } from '../utils/instructions';
import Button from '../components/Button';

type RootStackParamList = {
  PartyGameModeSetup: { playerNames: string[] };
  PartyChaosRuleSelection: { playerNames: string[]; gameMode: GameMode };
  PartyRoleReveal: { gameConfig: AdultsGameConfig };
};

type PartyChaosRuleSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PartyChaosRuleSelection'>;
type PartyChaosRuleSelectionScreenRouteProp = RouteProp<RootStackParamList, 'PartyChaosRuleSelection'>;

interface Props {
  navigation: PartyChaosRuleSelectionScreenNavigationProp;
  route: PartyChaosRuleSelectionScreenRouteProp;
}

const PartyChaosRuleSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { playerNames, gameMode } = route.params;
  const [selectedRules, setSelectedRules] = useState<ChaosRule[]>([]);
  const MAX_RULES = 6;

  const categories = getChaosRulesByCategory();

  const toggleRule = (rule: ChaosRule) => {
    if (selectedRules.find(r => r.id === rule.id)) {
      setSelectedRules(selectedRules.filter(r => r.id !== rule.id));
    } else {
      if (selectedRules.length < MAX_RULES) {
        setSelectedRules([...selectedRules, rule]);
      }
    }
  };

  const isRuleSelected = (rule: ChaosRule) => {
    return selectedRules.some(r => r.id === rule.id);
  };

  const createGameConfig = (playerNames: string[], gameMode: GameMode, chaosRules: ChaosRule[]): AdultsGameConfig => {
    const players: AdultsPlayer[] = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: name,
      role: 'actor' as AdultsRole,
      instruction: '',
      drinks: 0,
      chaosRuleViolations: 0,
      hasBeenDetective: false,
      detectiveCount: 0
    }));

    const detectiveIndex = Math.floor(Math.random() * players.length);
    const detective: AdultsPlayer = {
      ...players[detectiveIndex],
      role: 'detective' as AdultsRole,
      hasBeenDetective: true,
      detectiveCount: 1
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
                       gameMode === 'bo5' ? 5 : 1;

    const playerScores: PlayerScore[] = players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      score: 0,
      drinks: 0
    }));

    return {
      players,
      detective,
      instruction,
      gameMode: gameMode,
      currentRound: 1,
      totalRounds,
      playerScores,
      saboteurCount: 0,
      activeChaosRules: chaosRules,
      totalDrinks: 0,
      usedDetectives: [detective.id],
      roleRotationEnabled: true,
      nextDetectiveIndex: (detectiveIndex + 1) % players.length
    };
  };

  const handleContinue = () => {
    let rulesToUse = selectedRules;
    if (selectedRules.length === 0) {
      rulesToUse = getRandomChaosRules(3);
    }

    const gameConfig = createGameConfig(playerNames, gameMode, rulesToUse);
    navigation.navigate('PartyRoleReveal', { gameConfig });
  };

  const renderCategory = (title: string, rules: ChaosRule[]) => (
    <View style={styles.categorySection} key={title}>
      <Text style={styles.categoryTitle}>{title.toUpperCase()}</Text>
      <View style={styles.rulesGrid}>
        {rules.map((rule) => (
          <TouchableOpacity
            key={rule.id}
            style={[
              styles.ruleItem,
              isRuleSelected(rule) && styles.ruleItemSelected
            ]}
            onPress={() => toggleRule(rule)}
          >
            <Text style={styles.ruleName}>{rule.name}</Text>
            <Text style={styles.ruleDescription}>{rule.description}</Text>
            <View style={styles.rulePenalty}>
              <Text style={styles.rulePenaltyText}>
                Strafe: {rule.drinkingAction.amount} {rule.drinkingAction.type === 'sip' ? 'Schluck' : 'Shot'}
              </Text>
            </View>
            {isRuleSelected(rule) && (
              <Text style={styles.selectedBadge}>✅ AUSGEWÄHLT</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎲 CHAOS-REGELN AUSWÄHLEN 🎲</Text>
      
      <View style={styles.headerInfo}>
        <Text style={styles.subtitle}>
          Wähle bis zu {MAX_RULES} Chaos-Regeln aus
        </Text>
        <Text style={styles.selectedCount}>
          Ausgewählt: {selectedRules.length}/{MAX_RULES}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {Object.entries(categories).map(([category, rules]) => 
          renderCategory(category, rules)
        )}
      </ScrollView>

      <View style={styles.selectedRules}>
        <Text style={styles.selectedTitle}>AUSGEWÄHLTE REGELN:</Text>
        {selectedRules.length === 0 ? (
          <Text style={styles.noRulesText}>
            Keine Regeln ausgewählt - es werden 3 zufällige Regeln aktiviert
          </Text>
        ) : (
          selectedRules.map(rule => (
            <Text key={rule.id} style={styles.selectedRuleText}>• {rule.name}</Text>
          ))
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="🎪 CHAOS PARTY STARTEN!"
          onPress={handleContinue}
          color={ADULTS_COLORS.danger}
          size="large"
        />
        
        <Button 
          title="🔁 ZUFÄLLIGE REGELN"
          onPress={() => setSelectedRules(getRandomChaosRules(3))}
          color={ADULTS_COLORS.primary}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  headerInfo: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  subtitle: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 5,
  },
  selectedCount: {
    fontSize: 14,
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: ADULTS_COLORS.primary,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ADULTS_COLORS.accent,
  },
  rulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  ruleItem: {
    width: '48%',
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    marginBottom: 10,
    minHeight: 120,
  },
  ruleItemSelected: {
    borderColor: ADULTS_COLORS.warning,
    backgroundColor: ADULTS_COLORS.danger,
  },
  ruleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  ruleDescription: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    marginBottom: 8,
    lineHeight: 14,
  },
  rulePenalty: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 5,
    borderRadius: 5,
  },
  rulePenaltyText: {
    fontSize: 10,
    color: ADULTS_COLORS.warning,
    textAlign: 'center',
  },
  selectedBadge: {
    fontSize: 10,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  selectedRules: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedRuleText: {
    fontSize: 12,
    color: ADULTS_COLORS.warning,
    marginBottom: 3,
  },
  noRulesText: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
});

export default PartyChaosRuleSelectionScreen;