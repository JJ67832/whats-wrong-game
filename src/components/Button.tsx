import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large'; // NEUE SIZE-PROP
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  color = '#26495c',
  size = 'medium' // DEFAULT SIZE
}) => {
  // Größenbasierte Stile
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 20, paddingVertical: 10, minWidth: 120 };
      case 'large':
        return { paddingHorizontal: 40, paddingVertical: 16, minWidth: 250 };
      default: // medium
        return { paddingHorizontal: 30, paddingVertical: 13, minWidth: 200 };
    }
  };

  // Größenbasierte Text-Stile
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
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#e5e5dc',
    fontWeight: 'bold',
  },
});

export default Button;