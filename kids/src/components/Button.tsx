import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  color = '#4a90e2', // Kids Farbe: Hellblau
  size = 'medium'
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 25, paddingVertical: 12, minWidth: 140 };
      case 'large':
        return { paddingHorizontal: 45, paddingVertical: 18, minWidth: 280 };
      default: // medium
        return { paddingHorizontal: 35, paddingVertical: 15, minWidth: 220 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 20;
      default: return 18;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#CCCCCC' : color },
        getSizeStyle()
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { fontSize: getTextSize() }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20, // Runder für Kids-Design
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffffff', // Weißer Rand für Spielzeug-Optik
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Button;