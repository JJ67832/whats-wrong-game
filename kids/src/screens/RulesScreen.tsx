import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';

type RootStackParamList = {
  KidsHome: undefined;
  KidsRules: undefined;
};

type KidsRulesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'KidsRules'>;

interface Props {
  navigation: KidsRulesScreenNavigationProp;
}

const KidsRulesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>So geht's! 📖</Text>
        
        <View style={styles.rulesContainer}>
          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>👫 Vorbereitung</Text>
            <Text style={styles.ruleText}>• 2-8 Freunde können mitspielen</Text>
            <Text style={styles.ruleText}>• Jeder gibt seinen Namen ein</Text>
            <Text style={styles.ruleText}>• Ein Detektiv wird ausgewählt</Text>
            <Text style={styles.ruleText}>• Alle anderen sind Schauspieler</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎭 Rollen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Detektiv:</Text> Muss erraten, was die anderen machen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Schauspieler:</Text> Befolgen geheime Aufgaben</Text>
            <Text style={styles.ruleText}>• Jeder Schauspieler bekommt die gleiche lustige Aufgabe</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>⏱️ Spielablauf</Text>
            <Text style={styles.ruleText}>• Der Detektiv hat <Text style={styles.highlight}>15 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Er beobachtet die anderen genau</Text>
            <Text style={styles.ruleText}>• Schauspieler führen ihre geheimen Aufgaben aus</Text>
            <Text style={styles.ruleText}>• Aber nicht zu offensichtlich!</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>💡 Tipp-System</Text>
            <Text style={styles.ruleText}>• Der Detektiv kann <Text style={styles.highlight}>3 Tipps</Text> anfordern</Text>
            <Text style={styles.ruleText}>• Jeder Tipp kostet <Text style={styles.highlight}>2 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Tipps werden mit der Zeit besser</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎯 Ziel des Spiels</Text>
            <Text style={styles.ruleText}>• Detektiv: Errate die geheime Aufgabe</Text>
            <Text style={styles.ruleText}>• Schauspieler: Bleib unentdeckt!</Text>
            <Text style={styles.ruleText}>• Das Spiel endet bei Erfolg oder wenn die Zeit um ist</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🏆 Punkte</Text>
            <Text style={styles.ruleText}>• Detektiv gewinnt: 3 Punkte</Text>
            <Text style={styles.ruleText}>• Schauspieler gewinnen: Jeder bekommt 1 Punkt</Text>
            <Text style={styles.ruleText}>• Bei mehreren Runden werden Punkte addiert</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Zurück zum Start 🏠" 
            onPress={() => navigation.goBack()}
            color="#ffd166"
            size="large"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  rulesContainer: {
    flex: 1,
    gap: 20,
    marginBottom: 30,
  },
  ruleSection: {
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22,
    marginBottom: 6,
  },
  highlight: {
    color: '#ffd166',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default KidsRulesScreen;