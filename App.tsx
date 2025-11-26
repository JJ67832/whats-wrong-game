import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox, Platform, Dimensions, View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from './src/types';

// NEUE IMPORTS
import MainMenuScreen from './MainMenuScreen';
import KidsHomeScreen from './kids/src/screens/KidsHomeScreen'; 
import PartyHomeScreen from './adults/src/screens/PartyHomeScreen';

// Existierende Classic-Version Screens
import HomeScreen from './src/screens/HomeScreen';
import PlayerNameSetupScreen from './src/screens/PlayerNameSetupScreen';
import GameModeSetupScreen from './src/screens/GameModeSetupScreen';
import SaboteurModeSetupScreen from './src/screens/SaboteurModeSetupScreen';
import RoleRevealScreen from './src/screens/RoleRevealScreen';
import GameScreen from './src/screens/GameScreen';
import RulesScreen from './src/screens/RulesScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SaboteurVotingScreen from './src/screens/SaboteurVotingScreen';

// NEU: Kids Version Screens importieren
import KidsPlayerNameSetupScreen from './kids/src/screens/PlayerNameSetupScreen';
import KidsGameModeSetupScreen from './kids/src/screens/GameModeSetupScreen';
import KidsRoleRevealScreen from './kids/src/screens/RoleRevealScreen';
import KidsGameScreen from './kids/src/screens/GameScreen';
import KidsLeaderboardScreen from './kids/src/screens/LeaderboardScreen';
import KidsRulesScreen from './kids/src/screens/RulesScreen';

// NEU: Adults/Party Version Screens importieren
import PartyPlayerNameSetupScreen from './adults/src/screens/PartyPlayerNameSetupScreen';
import PartyGameModeSetupScreen from './adults/src/screens/PartyGameModeSetupScreen';
import PartyChaosRuleSelectionScreen from './adults/src/screens/PartyChaosRuleSelectionScreen';
import PartyRoleRevealScreen from './adults/src/screens/PartyRoleRevealScreen';
import PartyGameScreen from './adults/src/screens/PartyGameScreen';
import PartyLeaderboardScreen from './adults/src/screens/PartyLeaderboardScreen';
import PartyRulesScreen from './adults/src/screens/PartyRulesScreen';

// Ignoriere spezifische Warnungen
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// 🆕 MOBILE-ONLY CHECK
const MobileOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === 'web') {
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768 || height < 768;
    
    if (!isMobile) {
      return (
        <View style={styles.desktopContainer}>
          <Text style={styles.desktopTitle}>📱 Mobile Only</Text>
          <Text style={styles.desktopText}>
            Diese App ist speziell für mobile Geräte optimiert.
          </Text>
          <Text style={styles.desktopText}>
            Bitte öffnen Sie diese Seite auf einem Smartphone oder Tablet.
          </Text>
          <View style={styles.qrCode}>
            <Text style={styles.qrText}>📱 → 📲</Text>
          </View>
        </View>
      );
    }
  }
  
  return <>{children}</>;
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26495c',
    padding: 20,
  },
  desktopTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e5dc',
    marginBottom: 20,
  },
  desktopText: {
    fontSize: 18,
    color: '#e5e5dc',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  qrCode: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e5e5dc',
    borderRadius: 10,
  },
  qrText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// Stack Navigator KORRIGIERT - außerhalb der Komponente
const Stack = createStackNavigator<RootStackParamList>();

// 🆕 TYPE FIXES: Korrekte Typ-Definitionen für die Problem-Screens
type PartyRoleRevealProps = {
  navigation: any;
  route: any;
};

type PartyGameProps = {
  navigation: any;
  route: any;
};

type PartyLeaderboardProps = {
  navigation: any;
  route: any;
};

// 🆕 Typ-kompatible Komponenten erstellen
const PartyRoleRevealScreenWithProps = (props: PartyRoleRevealProps) => <PartyRoleRevealScreen {...props} />;
const PartyGameScreenWithProps = (props: PartyGameProps) => <PartyGameScreen {...props} />;
const PartyLeaderboardScreenWithProps = (props: PartyLeaderboardProps) => <PartyLeaderboardScreen {...props} />;

export default function App() {
  return (
    <MobileOnlyGuard>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="MainMenu"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#26495c',
            },
            headerTintColor: '#e5e5dc',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* Hauptmenü */}
          <Stack.Screen 
            name="MainMenu" 
            component={MainMenuScreen}
            options={{ headerShown: false }}
          />

          {/* CLASSIC VERSION */}
          <Stack.Screen 
            name="ClassicHome" 
            component={HomeScreen}
            options={{ title: "Classic Version", headerShown: false }}
          />
          <Stack.Screen 
            name="PlayerNameSetup" 
            component={PlayerNameSetupScreen}
            options={{ title: 'Spielernamen', headerBackTitle: 'Zurück' }}
          />
          <Stack.Screen 
            name="GameModeSetup" 
            component={GameModeSetupScreen}
            options={{ title: 'Spielmodus', headerBackTitle: 'Zurück' }}
          />
          <Stack.Screen 
            name="SaboteurModeSetup" 
            component={SaboteurModeSetupScreen}
            options={{ title: 'Saboteur-Modus', headerBackTitle: 'Zurück' }}
          />
          <Stack.Screen 
            name="RoleReveal" 
            component={RoleRevealScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ title: 'Detektiv Spiel', headerBackTitle: 'Zurück' }}
          />
          <Stack.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen}
            options={{ title: 'Leaderboard', headerBackTitle: 'Zurück' }}
          />
          <Stack.Screen 
            name="SaboteurVoting" 
            component={SaboteurVotingScreen}
            options={{ title: 'Saboteur-Abstimmung', headerBackTitle: 'Zurück' }}
          />

          {/* ALLGEMEINE SCREENS */}
          <Stack.Screen 
            name="Rules" 
            component={RulesScreen}
            options={{ title: 'Spielregeln', headerBackTitle: 'Zurück' }}
          />

          {/* KIDS VERSION */}
          <Stack.Screen 
            name="KidsHome" 
            component={KidsHomeScreen}
            options={{ title: "Kids Version", headerShown: false }}
          />
          <Stack.Screen 
            name="KidsPlayerNameSetup" 
            component={KidsPlayerNameSetupScreen}
            options={{ 
              title: 'Namen eingeben', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#4a90e2' }
            }}
          />
          <Stack.Screen 
            name="KidsGameModeSetup" 
            component={KidsGameModeSetupScreen}
            options={{ 
              title: 'Spielmodus', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#4a90e2' }
            }}
          />
          <Stack.Screen 
            name="KidsRoleReveal" 
            component={KidsRoleRevealScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="KidsGame" 
            component={KidsGameScreen}
            options={{ 
              title: 'Detektiv Spiel', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#4a90e2' }
            }}
          />
          <Stack.Screen 
            name="KidsLeaderboard" 
            component={KidsLeaderboardScreen}
            options={{ 
              title: 'Punkte', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#4a90e2' }
            }}
          />
          <Stack.Screen 
            name="KidsRules" 
            component={KidsRulesScreen}
            options={{ 
              title: 'Spielregeln', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#4a90e2' }
            }}
          />

          {/* 🆕 ADULTS/PARTY VERSION */}
          <Stack.Screen 
            name="PartyHome" 
            component={PartyHomeScreen}
            options={{ title: "18+ Party Version", headerShown: false }}
          />
          <Stack.Screen 
            name="PartyPlayerNameSetup" 
            component={PartyPlayerNameSetupScreen}
            options={{ 
              title: 'Party-Crew', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
          <Stack.Screen 
            name="PartyGameModeSetup" 
            component={PartyGameModeSetupScreen}
            options={{ 
              title: 'Party-Modus', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
          {/* 🆕 NEUER CHAOS-REGELN AUSWAHL-SCREEN */}
          <Stack.Screen 
            name="PartyChaosRuleSelection" 
            component={PartyChaosRuleSelectionScreen}
            options={{ 
              title: 'Chaos-Regeln', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
          {/* 🆕 KORRIGIERT: PartyRoleReveal mit korrekten Props */}
          <Stack.Screen 
            name="PartyRoleReveal" 
            component={PartyRoleRevealScreenWithProps}
            options={{ headerShown: false }}
          />
          {/* 🆕 KORRIGIERT: PartyGame mit korrekten Props */}
          <Stack.Screen 
            name="PartyGame" 
            component={PartyGameScreenWithProps}
            options={{ 
              title: 'Party-Spiel', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
          {/* 🆕 KORRIGIERT: PartyLeaderboard mit korrekten Props */}
          <Stack.Screen 
            name="PartyLeaderboard" 
            component={PartyLeaderboardScreenWithProps}
            options={{ 
              title: 'Party-Leaderboard', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
          <Stack.Screen 
            name="PartyRules" 
            component={PartyRulesScreen}
            options={{ 
              title: 'Party-Regeln', 
              headerBackTitle: 'Zurück',
              headerStyle: { backgroundColor: '#8b0000' },
              headerTintColor: '#FFFFFF'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MobileOnlyGuard>
  );
}