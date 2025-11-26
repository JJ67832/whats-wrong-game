import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';
import { RootStackParamList } from '../../../src/types';

type KidsHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsHome'>;

interface Props {
  navigation: KidsHomeScreenNavigationProp;
}

const KidsHomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/Home Screen/kids_background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      
      {/* Zurück Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('MainMenu')}
      >
        <Text style={styles.backButtonText}>← Zurück</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Was ist los?</Text>
          <Text style={styles.subtitle}>
            Das super lustige Ratespiel{'\n'}für coole Detektive!
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Spiel starten 🎮" 
            onPress={() => navigation.navigate('KidsPlayerNameSetup')}
            color="#ffd166"
            size="large"
          />
          
          <Button 
            title="So geht's 📖" 
            onPress={() => navigation.navigate('KidsRules')}
            color="#06d6a0"
            size="medium"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a90e2',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#4a90e2',
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffd166',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 209, 102, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#06d6a0',
  },
  backButtonText: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KidsHomeScreen;