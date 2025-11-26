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
// KORRIGIERTE IMPORTS
import { AdultsStackParamList, ADULTS_COLORS } from '../types';
import Button from '../components/Button';



type PartyPlayerNameSetupScreenNavigationProp = StackNavigationProp<AdultsStackParamList, 'PartyPlayerNameSetup'>;

interface Props {
  navigation: PartyPlayerNameSetupScreenNavigationProp;
}

const PartyPlayerNameSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);

  const updatePlayerCount = (count: number) => {
    if (count < 3) return;
    if (count > 10) {
      Alert.alert('Party Limit', 'Maximal 10 Spieler für die Chaos-Party!');
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
                    playerNames.length >= 3 && 
                    !hasDuplicateNames();

  const handleContinue = () => {
    if (hasDuplicateNames()) {
      Alert.alert('Fehler', 'Spielernamen müssen eindeutig sein! Bitte verwende unterschiedliche Namen.');
      return;
    }

    if (canContinue) {
      const trimmedNames = playerNames.map(name => name.trim());
      navigation.navigate('PartyGameModeSetup', { playerNames: trimmedNames });
    } else {
      Alert.alert('Fehler', 'Bitte gib für alle Spieler einen eindeutigen Namen ein (mindestens 3 Spieler)');
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
          <Text style={styles.title}>🎉 PARTY-CREW 🎉</Text>
          <Text style={styles.subtitle}>Wer macht bei der Chaos-Party mit?</Text>
          
          <View style={styles.counterSection}>
            <Text style={styles.sectionTitle}>Anzahl Party-Leute (3-10)</Text>
            <View style={styles.counterContainer}>
              <Button 
                title="-"
                onPress={() => updatePlayerCount(playerCount - 1)}
                color={ADULTS_COLORS.danger}
                size="small"
              />
              <Text style={styles.counterText}>{playerCount}</Text>
              <Button 
                title="+"
                onPress={() => updatePlayerCount(playerCount + 1)}
                color={ADULTS_COLORS.danger}
                size="small"
              />
            </View>
          </View>

          <View style={styles.namesSection}>
            <Text style={styles.sectionTitle}>Party-Namen</Text>
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
                    placeholder={`Party-Gast ${index + 1}`}
                    value={name}
                    onChangeText={(text) => updatePlayerName(index, text)}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    placeholderTextColor="#888"
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="WEITER ZU CHAOS-MODUS 🎲"
              onPress={handleContinue}
              disabled={!canContinue}
              color={canContinue ? ADULTS_COLORS.danger : ADULTS_COLORS.primary}
              size="large"
            />
            
            <Button 
              title="← ZURÜCK ZUR PARTY"
              onPress={() => navigation.goBack()}
              color={ADULTS_COLORS.primary}
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
    backgroundColor: ADULTS_COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  counterSection: {
    marginBottom: 30,
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
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
    color: ADULTS_COLORS.accent,
    minWidth: 40,
    textAlign: 'center',
    textShadowColor: ADULTS_COLORS.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  namesSection: {
    marginBottom: 20,
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
  },
  duplicateWarning: {
    color: ADULTS_COLORS.warning,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  namesContainer: {
    // Kein spezielles Styling nötig
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    fontSize: 16,
    color: ADULTS_COLORS.accent,
  },
  duplicateInput: {
    borderColor: ADULTS_COLORS.warning,
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
});

export default PartyPlayerNameSetupScreen;