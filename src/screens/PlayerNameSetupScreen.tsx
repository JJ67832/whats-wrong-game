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
  Home: undefined;
  PlayerNameSetup: undefined;
  GameModeSetup: { playerNames: string[] };
  PlayerSetup: { existingGameConfig?: any };
  RoleReveal: { gameConfig: any };
  Game: { gameConfig: any };
  Leaderboard: { gameConfig: any; detectiveWon: boolean };
};

type PlayerNameSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlayerNameSetup'>;

interface Props {
  navigation: PlayerNameSetupScreenNavigationProp;
}

const PlayerNameSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);

  const updatePlayerCount = (count: number) => {
    if (count < 2) return;
    if (count > 12) {
      Alert.alert('Info', 'Maximal 12 Spieler können mitspielen');
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
      Alert.alert('Fehler', 'Spielernamen müssen eindeutig sein! Bitte verwende unterschiedliche Namen.');
      return;
    }

    if (canContinue) {
      const trimmedNames = playerNames.map(name => name.trim());
      navigation.navigate('GameModeSetup', { playerNames: trimmedNames });
    } else {
      Alert.alert('Fehler', 'Bitte gib für alle Spieler einen eindeutigen Namen ein (mindestens 2 Spieler)');
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
          <Text style={styles.title}>Spielernamen eingeben</Text>
          
          <View style={styles.counterSection}>
            <Text style={styles.sectionTitle}>Spieleranzahl (2-12)</Text>
            <View style={styles.counterContainer}>
              <Button 
                title="-"
                onPress={() => updatePlayerCount(playerCount - 1)}
                color="#c66b3d"
                size="small"
              />
              <Text style={styles.counterText}>{playerCount}</Text>
              <Button 
                title="+"
                onPress={() => updatePlayerCount(playerCount + 1)}
                color="#c66b3d"
                size="small"
              />
            </View>
          </View>

          <View style={styles.namesSection}>
            <Text style={styles.sectionTitle}>Spielernamen</Text>
            {hasDuplicateNames() && (
              <Text style={styles.duplicateWarning}>⚠️ Namen müssen eindeutig sein!</Text>
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
                    placeholder={`Spieler ${index + 1}`}
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
              title="Weiter zu Spielmodus"
              onPress={handleContinue}
              disabled={!canContinue}
              color="#c66b3d"
            />
            
            <Button 
              title="Zurück zum Menü"
              onPress={() => navigation.navigate('Home')}
              color="#26495c"
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
    backgroundColor: '#e5e5dc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 30,
  },
  counterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#26495c',
    marginBottom: 15,
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#26495c',
    minWidth: 40,
    textAlign: 'center',
  },
  namesSection: {
    marginBottom: 20,
  },
  duplicateWarning: {
    color: '#c66b3d',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  namesContainer: {
    // Kein spezielles Styling nötig, da ScrollView den Inhalt verwaltet
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c4a35a',
    fontSize: 16,
    color: '#26495c',
  },
  duplicateInput: {
    borderColor: '#c66b3d',
    backgroundColor: '#fff0f0',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default PlayerNameSetupScreen;