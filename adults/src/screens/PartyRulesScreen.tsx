import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
// KORRIGIERTE IMPORTS
import { AdultsStackParamList, ADULTS_COLORS } from '../types';
import Button from '../components/Button';

// REST DER DATEI UNVERÄNDERT

type PartyRulesScreenNavigationProp = StackNavigationProp<AdultsStackParamList, 'PartyRules'>;

interface Props {
  navigation: PartyRulesScreenNavigationProp;
}

const PartyRulesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🎉 PARTY-REGELN 🎉</Text>
        <Text style={styles.subtitle}>What's Wrong? - Chaos Edition</Text>
        
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            🚫 NUR FÜR ERWACHSENE! 🚫{'\n'}
            Genießt verantwortungsvoll! 🍻
          </Text>
        </View>

        <View style={styles.rulesContainer}>
          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎪 VORBEREITUNG</Text>
            <Text style={styles.ruleText}>• 3-10 Party-Gäste können mitspielen</Text>
            <Text style={styles.ruleText}>• Jeder Gast gibt seinen Party-Namen ein</Text>
            <Text style={styles.ruleText}>• Ein Detektiv wird zufällig ausgewählt</Text>
            <Text style={styles.ruleText}>• 2-6 Chaos-Regeln werden aktiviert</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎭 PARTY-ROLLEN</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>DETEKTIV:</Text> Muss erraten, was falsch läuft</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>PARTY-AKTEURE:</Text> Befolgen geheime Anweisungen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>KEIN SABOTEUR:</Text> In der Party-Version konzentrieren wir uns auf Chaos!</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎲 CHAOS-REGELN SYSTEM</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>2-6 zufällige Regeln</Text> pro Spiel</Text>
            <Text style={styles.ruleText}>• Regeln aktivieren automatisch Trink-Strafen</Text>
            <Text style={styles.ruleText}>• Unterschiedliche Trigger: Start, falsche Vermutung, Tipp-Nutzung, zufällig</Text>
            <Text style={styles.ruleText}>• Verschiedene Ziele: Einzelne Spieler, alle, Detektiv</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>⏱️ PARTY-ABLAUF</Text>
            <Text style={styles.ruleText}>• Der Detektiv hat <Text style={styles.highlight}>15 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Er beobachtet die Party-Gäste genau</Text>
            <Text style={styles.ruleText}>• Akteure führen ihre geheimen Anweisungen aus</Text>
            <Text style={styles.ruleText}>• Chaos-Regeln können jederzeit zuschlagen!</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>💡 TIPP-SYSTEM</Text>
            <Text style={styles.ruleText}>• Der Detektiv kann <Text style={styles.highlight}>3 Tipps</Text> anfordern</Text>
            <Text style={styles.ruleText}>• Jeder Tipp kostet <Text style={styles.highlight}>2 Minuten</Text> Zeit</Text>
            <Text style={styles.ruleText}>• Tipp-Nutzung kann Chaos-Regeln auslösen!</Text>
            <Text style={styles.ruleText}>• Tipps werden mit der Zeit spezifischer</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🍻 TRINK-REGELN</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Schluck:</Text> 1 Schluck Bier/Getränk</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Shot:</Text> 1 Shot nach Wahl</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Social:</Text> Alle trinken gleichzeitig</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Falsche Vermutung:</Text> Detektiv trinkt 1 Shot</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Erfolg:</Text> Verlierer-Team trinkt</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🎯 BESONDERE FEATURES</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Wahrheit oder Shot:</Text> Bei falscher Vermutung wählen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Russisch Roulette:</Text> 6 Kammern, verschiedene Strafen</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Trink-Statistiken:</Text> Verfolge wer am meisten trinkt</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Party-Bonus:</Text> Extra-Punkte für viel getrunken</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>🏆 PARTY-ZIEL</Text>
            <Text style={styles.ruleText}>• Detektiv: Errate die geheimen Anweisungen</Text>
            <Text style={styles.ruleText}>• Party-Akteure: Bleibt unentdeckt!</Text>
            <Text style={styles.ruleText}>• Bonus: Werde Top-Trinker der Party!</Text>
            <Text style={styles.ruleText}>• Das Spiel endet bei Erfolg oder Zeitablauf</Text>
          </View>

          <View style={styles.ruleSection}>
            <Text style={styles.sectionTitle}>⚡ CHAOS-BEISPIELE</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Schnell-Runde:</Text> Nur 30 Sekunden Zeit!</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Stumm-Runde:</Text> Detektiv darf nicht reden</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Handy-Strafe:</Text> Wer aufs Handy schaut → Shot!</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Lach-Anfall:</Text> Wer lacht → 1 Schluck!</Text>
            <Text style={styles.ruleText}>• <Text style={styles.highlight}>Trink-Wort:</Text> Bei bestimmten Wörtern trinken</Text>
          </View>
        </View>

        <View style={styles.safetyNotice}>
          <Text style={styles.safetyTitle}>⚠️ WICHTIGER HINWEIS</Text>
          <Text style={styles.safetyText}>
            Dies ist ein Partyspiel. Bitte trinkt verantwortungsvoll, bleibt sicher und respektiert eure Grenzen. 
            Niemand sollte sich zum Trinken gezwungen fühlen. Wasser und alkoholfreie Getränke sind immer eine Option!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="🎪 ZURÜCK ZUR PARTY" 
            onPress={() => navigation.goBack()}
            color={ADULTS_COLORS.danger}
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
    backgroundColor: ADULTS_COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ADULTS_COLORS.danger,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    textShadowColor: ADULTS_COLORS.accent,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  warningBanner: {
    backgroundColor: ADULTS_COLORS.danger,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: ADULTS_COLORS.warning,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.accent,
    textAlign: 'center',
    lineHeight: 22,
  },
  rulesContainer: {
    flex: 1,
    gap: 20,
    marginBottom: 30,
  },
  ruleSection: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: ADULTS_COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 12,
    textAlign: 'center',
  },
  ruleText: {
    fontSize: 14,
    color: ADULTS_COLORS.accent,
    lineHeight: 20,
    marginBottom: 6,
  },
  highlight: {
    color: ADULTS_COLORS.danger,
    fontWeight: 'bold',
  },
  safetyNotice: {
    backgroundColor: ADULTS_COLORS.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: ADULTS_COLORS.warning,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ADULTS_COLORS.warning,
    marginBottom: 10,
    textAlign: 'center',
  },
  safetyText: {
    fontSize: 12,
    color: ADULTS_COLORS.accent,
    lineHeight: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default PartyRulesScreen;