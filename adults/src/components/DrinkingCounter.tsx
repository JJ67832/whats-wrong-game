// adults/src/components/DrinkingCounter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ADULTS_COLORS } from '../types';

interface Props {
  playerName: string;
  drinks: number;
  isDetective?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const DrinkingCounter: React.FC<Props> = ({ 
  playerName, 
  drinks, 
  isDetective = false,
  onIncrement,
  onDecrement
}) => {
  const getDrunkLevel = () => {
    if (drinks === 0) return '🥤 Nüchtern';
    if (drinks <= 3) return '🍺 Angetrunken';
    if (drinks <= 6) return '🥴 Beschwipst';
    if (drinks <= 9) return '😵 Betrunken';
    return '🤪 Volltrunken';
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDetective ? ADULTS_COLORS.danger : ADULTS_COLORS.primary,
        borderColor: ADULTS_COLORS.accent
      }
    ]}>
      <Text style={styles.playerName}>
        {playerName} {isDetective && '🔍'}
      </Text>
      
      <View style={styles.drinksContainer}>
        <Text style={styles.drinksCount}>{drinks} Getränke</Text>
        <Text style={styles.drunkLevel}>{getDrunkLevel()}</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(100, (drinks / 10) * 100)}%`,
              backgroundColor: drinks >= 8 ? ADULTS_COLORS.danger : ADULTS_COLORS.warning
            }
          ]} 
        />
      </View>

      {/* 🆕 PLUS/MINUS BUTTONS FÜR MANUELLE ANPASSUNG */}
      {(onIncrement || onDecrement) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button,
              styles.minusButton,
              drinks === 0 && styles.disabledButton
            ]}
            onPress={onDecrement}
            disabled={drinks === 0}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.drinksLabel}>Schlücke</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.plusButton]}
            onPress={onIncrement}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    marginBottom: 8,
  },
  drinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  drinksCount: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontWeight: '600',
  },
  drunkLevel: {
    fontSize: 12,
    color: ADULTS_COLORS.warning,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  // 🆕 STYLES FÜR DIE BUTTONS
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  plusButton: {
    backgroundColor: ADULTS_COLORS.success,
  },
  minusButton: {
    backgroundColor: ADULTS_COLORS.danger,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
  },
  drinksLabel: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
  },
});

export default DrinkingCounter;