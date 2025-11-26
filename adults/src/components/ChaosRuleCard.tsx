// adults/src/components/ChaosRuleCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChaosRule, ADULTS_COLORS } from '../types';

interface Props {
  rule: ChaosRule;
  isActive?: boolean;
}

const ChaosRuleCard: React.FC<Props> = ({ rule, isActive = false }) => {
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isActive ? ADULTS_COLORS.danger : ADULTS_COLORS.primary,
        borderColor: ADULTS_COLORS.accent
      }
    ]}>
      <Text style={styles.name}>
        {rule.name} {rule.id === 'whisper_mode' && '🔊→🤫'}
      </Text>
      <Text style={styles.description}>{rule.description}</Text>
      <View style={styles.drinkingAction}>
        <Text style={styles.drinkingText}>
          🍻 {rule.drinkingAction.amount} {rule.drinkingAction.type === 'sip' ? 'Schluck(e)' : 'Shot(s)'} - {rule.drinkingAction.target === 'all' ? 'Alle' : rule.drinkingAction.target}
        </Text>
      </View>
      {/* 🆕 Spezieller Hinweis für Flüstermodus */}
      {rule.id === 'whisper_mode' && (
        <Text style={styles.whisperHint}>
          💡 Tipp: Alle müssen leise sprechen - lautes Reden wird bestraft!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    marginBottom: 8,
    lineHeight: 18,
  },
  drinkingAction: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 5,
    borderRadius: 5,
  },
  drinkingText: {
    fontSize: 12,
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  whisperHint: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    fontStyle: 'italic',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ChaosRuleCard;