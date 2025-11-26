import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';

type RootStackParamList = {
  KidsHome: undefined;
  KidsPlayerNameSetup: undefined;
  KidsGameModeSetup: { playerNames: string[] };
};

type KidsPlayerNameSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsPlayerNameSetup'>;

interface Props {
  navigation: KidsPlayerNameSetupScreenNavigationProp;
}

const KidsPlayerNameSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);

  const updatePlayerCount = (count: number) => {
    if (count < 2) return;
    if (count > 8) { // Weniger Spieler für Kids
      Alert.alert('Hoppla!', 'Maximal 8 Freunde können mitspielen!');
      return;
    }
    
    setPlayerCount(count);
    const newNames = [...playerNames];
    while (newNames.length < count) newNames.push('');
    while (newNames.length > count) newNames.pop();
    setPlayerNames(newNames);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const hasDuplicateNames = (): boolean => {
    const trimmedNames = playerNames.map(name => name.trim().toLowerCase());
    const uniqueNames = new Set(trimmedNames);
    return uniqueNames.size !== trimmedNames.length;
  };

  const canContinue = playerNames.every(name => name.trim().length > 0) && 
                    playerNames.length >= 2 && 
                    !hasDuplicateNames();

  const handleContinue = () => {
    if (hasDuplicateNames()) {
      Alert.alert('Achtung!', 'Jeder Name muss anders sein! Bitte denk dir andere Namen aus.');
      return;
    }

    if (canContinue) {
      const trimmedNames = playerNames.map(name => name.trim());
      navigation.navigate('KidsGameModeSetup', { playerNames: trimmedNames });
    } else {
      Alert.alert('Noch nicht fertig!', 'Gib für alle Freunde einen Namen ein (mindestens 2 Freunde)');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Wie heißen eure Freunde? 👫</Text>
          
          <View style={styles.counterSection}>
            <Text style={styles.sectionTitle}>Wie viele spielen mit? (2-8)</Text>
            <View style={styles.counterContainer}>
              <Button 
                title="-"
                onPress={() => updatePlayerCount(playerCount - 1)}
                color="#ffd166"
                size="small"
              />
              <Text style={styles.counterText}>{playerCount}</Text>
              <Button 
                title="+"
                onPress={() => updatePlayerCount(playerCount + 1)}
                color="#ffd166"
                size="small"
              />
            </View>
          </View>

          <View style={styles.namesSection}>
            <Text style={styles.sectionTitle}>Namen eintragen ✏️</Text>
            {hasDuplicateNames() && (
              <Text style={styles.duplicateWarning}>⚠️ Jeder Name muss anders sein!</Text>
            )}
            <View style={styles.namesContainer}>
              {playerNames.map((name, index) => (
                <View key={index}>
                  <TextInput
                    style={[
                      styles.input,
                      playerNames.some((n, i) => i !== index && n.trim().toLowerCase() === name.trim().toLowerCase()) && 
                      styles.duplicateInput
                    ]}
                    placeholder={`Freund ${index + 1}`}
                    value={name}
                    onChangeText={(text) => updatePlayerName(index, text)}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="Weiter zum Spiel 🎲"
              onPress={handleContinue}
              disabled={!canContinue}
              color="#06d6a0"
              size="large"
            />
            
            <Button 
              title="Zurück zum Start 🏠"
              onPress={() => navigation.navigate('KidsHome')}
              color="#4a90e2"
              size="medium"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
  },
  counterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 15,
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#4a90e2',
    minWidth: 40,
    textAlign: 'center',
  },
  namesSection: {
    marginBottom: 20,
  },
  duplicateWarning: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  namesContainer: {
    // Kein spezielles Styling nötig
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#ffd166',
    fontSize: 18,
    color: '#4a90e2',
    textAlign: 'center',
  },
  duplicateInput: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff0f0',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default KidsPlayerNameSetupScreen;