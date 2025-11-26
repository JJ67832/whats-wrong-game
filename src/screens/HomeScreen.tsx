import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';

type RootStackParamList = {
  Home: undefined;
  PlayerNameSetup: undefined;
  GameModeSetup: { playerNames: string[] };
  Rules: undefined;
  MainMenu: undefined; // Hinzugefügt
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/Home Screen/people at table.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
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
          <Text style={styles.title}>What's Wrong?</Text>
          <Text style={styles.subtitle}>
            Das interaktive Ratespiel
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Spiel starten" 
            onPress={() => navigation.navigate('PlayerNameSetup')}
            color="#c66b3d"
            size="large"
          />
          
          <Button 
            title="Spielregeln" 
            onPress={() => navigation.navigate('Rules')}
            color="#c4a35a"
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
    backgroundColor: '#26495c',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#26495c',
    opacity: 0.3,
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
    color: '#c4a35a',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#e5e5dc',
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(198, 107, 61, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#c4a35a',
  },
  backButtonText: {
    color: '#e5e5dc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;