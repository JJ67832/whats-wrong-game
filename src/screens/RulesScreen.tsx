import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';

type RootStackParamList = {
  Home: undefined;
  Rules: undefined;
};

type RulesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rules'>;

interface Props {
  navigation: RulesScreenNavigationProp;
}

const RulesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Spielregeln</Text>
        
        <View style={styles.rulesContainer}>
          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>📋 Vorbereitung</Text>
            <Text style={styles.ruleText}>• 2-12 Spieler können mitspielen</Text>
            <Text style={styles.ruleText}>• Jeder Spieler gibt seinen Namen ein</Text>
            <Text style={styles.ruleText}>• Ein Detektiv wird zufällig ausgewählt</Text>
            <Text style={styles.ruleText}>• Optional: 1 oder mehrere Saboteure werden ausgewählt</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎭 Rollenverteilung</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Detektiv:</Text> Muss erraten, was falsch läuft</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Akteure:</Text> Befolgen geheime Anweisungen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Saboteur:</Text> Arbeitet heimlich mit dem Detektiv (optional)</Text>
            <Text style={styles.ruleText}>• Jeder Akteur und Saboteur erhält eine individuelle Anweisung</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🕵️‍♂️ Der Saboteur</Text>
            <Text style={styles.ruleText}>• Kann als zusätzliche Rolle aktiviert werden</Text>
            <Text style={styles.ruleText}>• Arbeitet heimlich mit dem Detektiv zusammen</Text>
            <Text style={styles.ruleText}>• Muss die geheime Anweisung herausfinden</Text>
            <Text style={styles.ruleText}>• Alle 3 Minuten gibt es eine Saboteur-Abstimmung</Text>
            <Text style={styles.ruleText}>• Wird entlarvt: 0 Punkte</Text>
            <Text style={styles.ruleText}>• Gewinnt mit Detektiv: 5 Punkte + 1 Punkt für Detektiv</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>⏱️ Spielablauf</Text>
            <Text style={styles.ruleText}>• Der Detektiv hat <Text style={styles.highlight}>15 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Er beobachtet die anderen Spieler genau</Text>
            <Text style={styles.ruleText}>• Akteure führen ihre geheimen Anweisungen aus</Text>
            <Text style={styles.ruleText}>• Saboteur versucht, die Anweisung zu erraten</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>💡 Tipp-System</Text>
            <Text style={styles.ruleText}>• Der Detektiv kann <Text style={styles.highlight}>3 Tipps</Text> anfordern</Text>
            <Text style={styles.ruleText}>• Jeder Tipp kostet <Text style={styles.highlight}>2 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Tipps werden mit der Zeit spezifischer</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🤔 Saboteur-Abstimmung</Text>
            <Text style={styles.ruleText}>• Alle 3 Minuten wird eine Abstimmung gestartet</Text>
            <Text style={styles.ruleText}>• Alle Spieler (außer Detektiv) stimmen ab, wer der Saboteur ist</Text>
            <Text style={styles.ruleText}>• Wird der Saboteur entlarvt, scheidet er/sie aus</Text>
            <Text style={styles.ruleText}>• Ansonsten geht das Spiel normal weiter</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎯 Ziel des Spiels</Text>
            <Text style={styles.ruleText}>• Detektiv: Errate die geheimen Anweisungen</Text>
            <Text style={styles.ruleText}>• Akteure: Bleibt unentdeckt!</Text>
            <Text style={styles.ruleText}>• Saboteur: Bleibt unentdeckt und hilft dem Detektiv</Text>
            <Text style={styles.ruleText}>• Das Spiel endet bei Erfolg oder Zeitablauf</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Zurück zum Hauptmenü" 
            onPress={() => navigation.goBack()}
            color="#c66b3d"
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
    backgroundColor: '#e5e5dc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#26495c',
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
    backgroundColor: '#26495c',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#e5e5dc',
    lineHeight: 20,
    marginBottom: 6,
  },
  highlight: {
    color: '#c66b3d',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default RulesScreen;