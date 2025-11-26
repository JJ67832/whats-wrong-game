// adults/src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { ADULTS_COLORS } from '../types';

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
  color = ADULTS_COLORS.primary,
  size = 'medium'
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 20, paddingVertical: 10, minWidth: 120 };
      case 'large':
        return { paddingHorizontal: 40, paddingVertical: 16, minWidth: 250 };
      default:
        return { paddingHorizontal: 30, paddingVertical: 13, minWidth: 200 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? '#666' : color,
          borderColor: ADULTS_COLORS.accent,
        },
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
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: ADULTS_COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: ADULTS_COLORS.accent,
    fontWeight: 'bold',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Button;