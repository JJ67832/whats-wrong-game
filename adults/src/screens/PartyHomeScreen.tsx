import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdultsStackParamList, ADULTS_COLORS } from '../types';
import Button from '../components/Button';

type PartyHomeScreenNavigationProp = StackNavigationProp<AdultsStackParamList, 'PartyHome'>;

interface Props {
  navigation: PartyHomeScreenNavigationProp;
}

const PartyHomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/party-background.jpg')}
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
          <Text style={styles.title}>WHAT'S WRONG?</Text>
          <Text style={styles.subtitle}>
            PARTY CHAOS EDITION
          </Text>
          <Text style={styles.warning}>🍻 18+ TRINKSPIEL 🍻</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="PARTY STARTEN 🥃" 
            onPress={() => navigation.navigate('PartyPlayerNameSetup')}
            color={ADULTS_COLORS.danger}
            size="large"
          />
          
          <Button 
            title="PARTY-REGELN 📖" 
            onPress={() => navigation.navigate('PartyRules')}
            color={ADULTS_COLORS.primary}
            size="medium"
          />
        </View>
        
        <Text style={styles.disclaimer}>
          Nur für Erwachsene! Genießt verantwortungsvoll. 🍻
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ADULTS_COLORS.background,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: ADULTS_COLORS.secondary,
    opacity: 0.7,
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
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  warning: {
    fontSize: 18,
    color: ADULTS_COLORS.warning,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  features: {
    backgroundColor: 'rgba(139, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },
  feature: {
    fontSize: 16,
    color: ADULTS_COLORS.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  disclaimer: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(139, 0, 0, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  backButtonText: {
    color: ADULTS_COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PartyHomeScreen;