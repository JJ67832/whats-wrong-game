import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { RouletteWheelProps, RouletteResult, ADULTS_COLORS } from '../types';

const { width } = Dimensions.get('window');

const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  onSpinComplete, 
  chamberCount = 8
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [currentChamber, setCurrentChamber] = useState(0);

  // 🎯 Classic-Design Roulette-Ergebnisse OHNE Totenköpfe
  const rouletteResults: RouletteResult[] = [
    { chamber: 1, drinks: 0, type: 'sip', target: 'player', penalty: 'Glück gehabt!', text: '🎉 Glück gehabt! Keine Strafe!' },
    { chamber: 2, drinks: 1, type: 'sip', target: 'player', penalty: 'Leichte Strafe', text: '🍺  1 Schluck für dich!' },
    { chamber: 3, drinks: 2, type: 'sip', target: 'player', penalty: 'Mittlere Strafe', text: '🍺🍺  2 Schlucke für dich!' },
    { chamber: 4, drinks: 1, type: 'shot', target: 'player', penalty: 'Schwere Strafe', text: '🥃  1 Shot für dich!' },
    { chamber: 5, drinks: 1, type: 'sip', target: 'all', penalty: 'Soziales Trinken', text: '👥  1 Schluck für ALLE!' },
    { chamber: 6, drinks: 2, type: 'shot', target: 'detective', penalty: 'Detektiv-Strafe', text: '🔍  2 Shots für den Detektiv!' },
    { chamber: 7, drinks: 3, type: 'sip', target: 'player', penalty: 'Volltreffer', text: '💥  3 SCHLUCKE für dich!' },
    { chamber: 8, drinks: 0, type: 'sip', target: 'player', penalty: 'Immunität', text: '🛡️  Immunität! Keine Strafe!' }
  ];

  // 🎨 Classic-Design Farben (Rot-Schwarz-Weiß)
  const classicColors = ['#8b0000', '#000000', '#8b0000', '#000000', '#8b0000', '#000000', '#8b0000', '#000000'];
  const classicTextColors = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomRotations = 5 + Math.floor(Math.random() * 5);
    const randomChamber = Math.floor(Math.random() * chamberCount);
    
    const spinAnimation = Animated.timing(spinValue, {
      toValue: randomRotations * 360 + (randomChamber * (360 / chamberCount)),
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    spinAnimation.start(() => {
      setIsSpinning(false);
      setCurrentChamber(randomChamber);
      const result = rouletteResults[randomChamber];
      onSpinComplete(result);
    });

    spinValue.setValue(0);
  };

  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const wheelSize = Math.min(width * 0.8, 300);

  return (
    <View style={styles.container}>
      {/* 🎯 Classic Roulette Rad */}
      <View style={[styles.wheelContainer, { width: wheelSize, height: wheelSize }]}>
        <Animated.View
          style={[
            styles.wheel,
            {
              width: wheelSize,
              height: wheelSize,
              borderRadius: wheelSize / 2,
              transform: [{ rotate: rotateInterpolate }],
              borderColor: '#FFFFFF',
              borderWidth: 4,
            },
          ]}
        >
          {rouletteResults.map((result, index) => {
            const segmentAngle = 360 / chamberCount;
            const rotation = (index * segmentAngle) - 45;
            
            return (
              <View
                key={result.chamber}
                style={[
                  styles.segment,
                  {
                    width: wheelSize / 2,
                    height: wheelSize,
                    transform: [
                      { rotate: `${rotation}deg` },
                      { translateX: wheelSize / 4 }
                    ],
                    backgroundColor: classicColors[index],
                    borderRightWidth: 2,
                    borderRightColor: '#FFFFFF',
                  },
                ]}
              >
                <Text style={[
                  styles.segmentNumber,
                  { 
                    transform: [{ rotate: `${-rotation}deg` }],
                    color: classicTextColors[index],
                  }
                ]}>
                  {result.chamber}
                </Text>
                
                {/* Emoji für die Strafe */}
                <Text style={[
                  styles.segmentEmoji,
                  { 
                    transform: [{ rotate: `${-rotation}deg` }],
                  }
                ]}>
                  {result.drinks === 0 ? '🛡️' : 
                   result.drinks === 1 ? '🍺' : 
                   result.drinks === 2 ? '🍺🍺' : '💥'}
                </Text>
              </View>
            );
          })}
          
          {/* Mittelpunkt im Classic-Design */}
          <View style={[styles.centerCircle, { 
            width: wheelSize * 0.15, 
            height: wheelSize * 0.15,
            borderRadius: wheelSize * 0.075,
            backgroundColor: '#FFFFFF',
            borderWidth: 3,
            borderColor: '#8b0000'
          }]} />
        </Animated.View>
        
        {/* Klassischer Zeiger */}
        <View style={[styles.pointer, { 
          top: -10,
          borderBottomColor: '#8b0000'
        }]} />
      </View>

      {/* 🎯 Classic Spin-Button */}
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spinWheel}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? '🎰 DREHT...' : '🎯 ROULETTE DREHEN!'}
        </Text>
      </TouchableOpacity>

      {/* ℹ️ Classic Design Info */}
      <View style={styles.designInfo}>
        <Text style={styles.designInfoText}>
          🎯 CLASSIC ROULETTE DESIGN
        </Text>
        <Text style={styles.designHint}>
          Traditionelles Rot-Schwarz Design
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  wheel: {
    position: 'relative',
    backgroundColor: ADULTS_COLORS.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  segment: {
    position: 'absolute',
    left: '50%',
    top: 0,
    transformOrigin: 'left center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 35,
    marginBottom: 10,
  },
  segmentEmoji: {
    fontSize: 14,
    marginLeft: 35,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -1 }, { translateY: -1 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pointer: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8b0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  spinButton: {
    backgroundColor: ADULTS_COLORS.danger,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spinButtonDisabled: {
    opacity: 0.6,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
  },
  designInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ADULTS_COLORS.accent,
    alignItems: 'center',
  },
  designInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 4,
  },
  designHint: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});

export default RouletteWheel;