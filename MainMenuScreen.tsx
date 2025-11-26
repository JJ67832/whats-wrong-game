import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  MainMenu: undefined;
  ClassicHome: undefined;
  KidsHome: undefined;
  PartyHome: undefined;
  Rules: undefined;
};

type MainMenuNavigationProp = StackNavigationProp<RootStackParamList, 'MainMenu'>;

interface Props {
  navigation: MainMenuNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const gameVersions = [
    {
      id: 'classic',
      title: 'CLASSIC VERSION',
      description: 'Das originale Detektiv-Spiel für strategische Köpfe und Rätselfreunde',
      icon: '🎭',
      color: '#26495c',
      accentColor: '#c4a35a',
      features: ['Strategisches Detektiv-Spiel', 'Für 2-12 Spieler', 'Mit Saboteur-Modus'],
      pattern: '🔍🕵️‍♂️✨',
      pathPosition: 'left',
    },
    {
      id: 'kids', 
      title: 'KIDS VERSION',
      description: 'Familienfreundliche Edition mit bunten Charakteren und kindgerechten Inhalten',
      icon: '🐻',
      color: '#4a90e2',
      accentColor: '#ffd166',
      features: ['Kindgerechte Inhalte', 'Bunte Grafiken & Sounds', 'Einfache Regeln'],
      pattern: '🐻🌈🎈',
      pathPosition: 'right',
    },
    {
      id: 'party',
      title: '18+ PARTY VERSION',
      description: 'Trinkspiel-Edition mit frechen Aufgaben und Party-Regeln',
      icon: '🍻',
      color: '#8b0000',
      accentColor: '#ff6b6b',
      features: ['Party-Trinkspiel Regeln', '18+ Inhalte', 'Extra Spiele & Challenges'],
      pattern: '🍻🎉🎊',
      pathPosition: 'left',
    },
  ];

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
    setTimeout(() => {
      switch (versionId) {
        case 'classic':
          navigation.navigate('ClassicHome');
          break;
        case 'kids':
          navigation.navigate('KidsHome');
          break;
        case 'party':
          navigation.navigate('PartyHome');
          break;
      }
    }, 300);
  };

  const renderPathConnectors = () => {
    return (
      <View style={styles.pathContainer}>
        {/* Erster Pfeil von Classic zu Kids */}
        <View style={[styles.arrowContainer, styles.arrow1]}>
          <Text style={styles.arrow}>➤</Text>
          <View style={[styles.arrowLine, styles.arrowLine1]} />
        </View>
        
        {/* Zweiter Pfeil von Kids zu Party */}
        <View style={[styles.arrowContainer, styles.arrow2]}>
          <Text style={styles.arrow}>➤</Text>
          <View style={[styles.arrowLine, styles.arrowLine2]} />
        </View>
        
        {/* Hauptpfad-Linie */}
        <View style={styles.mainPathLine} />
      </View>
    );
  };

  const renderVersionCard = (version: typeof gameVersions[0], index: number) => {
    const isSelected = selectedVersion === version.id;
    
    return (
      <Animated.View 
        key={version.id}
        style={[
          styles.versionCard,
          styles[`${version.pathPosition}Card` as keyof typeof styles],
          {
            backgroundColor: version.color,
            transform: [{ scale: isSelected ? 1.05 : 1 }],
          }
        ]}
      >
        {/* Pattern Hintergrund */}
        <View style={styles.patternBackground}>
          <Text style={[styles.patternText, { color: version.accentColor }]}>
            {version.pattern}
          </Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Icon & Title */}
          <View style={styles.cardHeader}>
            <Text style={styles.versionIcon}>{version.icon}</Text>
            <View style={styles.titleContainer}>
              <Text style={[styles.versionTitle, { color: version.accentColor }]}>
                {version.title}
              </Text>
              <View style={[styles.pathDot, { backgroundColor: version.accentColor }]} />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.versionDescription}>
            {version.description}
          </Text>

          {/* Features */}
          <View style={styles.featuresList}>
            {version.features.map((feature, featureIndex) => (
              <Text key={featureIndex} style={styles.featureItem}>
                • {feature}
              </Text>
            ))}
          </View>

          {/* Select Button */}
          <View style={styles.buttonContainer}>
            <Text 
              style={[
                styles.selectButton,
                { 
                  backgroundColor: version.accentColor,
                  color: version.color,
                }
              ]}
              onPress={() => handleVersionSelect(version.id)}
            >
              Auswählen
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>What's Wrong?</Text>
          <Text style={styles.subtitle}>
            Folge dem Pfad und wähle dein Abenteuer
          </Text>
        </View>

        {/* Thematischer Parcours */}
        <View style={styles.parcoursContainer}>
          {renderPathConnectors()}
          {gameVersions.map((version, index) => renderVersionCard(version, index))}
        </View>

        {/* Rules Button */}
        <View style={styles.rulesSection}>
          <Text 
            style={styles.rulesButton}
            onPress={() => navigation.navigate('Rules')}
          >
            Spielregeln anzeigen
          </Text>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Jede Version bietet ein einzigartiges Erlebnis auf demselben Spielprinzip
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  parcoursContainer: {
    minHeight: 600,
    marginBottom: 30,
    position: 'relative',
  },
  pathContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  mainPathLine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1.5,
    top: 80,
    bottom: 80,
    width: 3,
    backgroundColor: '#26495c',
    opacity: 0.3,
    borderRadius: 2,
  },
  arrowContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow1: {
    top: '33%',
    left: '55%',
  },
  arrow2: {
    top: '66%', 
    left: '45%',
  },
  arrow: {
    fontSize: 20,
    color: '#26495c',
    opacity: 0.6,
  },
  arrowLine: {
    height: 2,
    backgroundColor: '#26495c',
    opacity: 0.3,
  },
  arrowLine1: {
    width: 60,
  },
  arrowLine2: {
    width: 60,
  },
  versionCard: {
    borderRadius: 20,
    marginVertical: 30,
    width: screenWidth * 0.75,
    minHeight: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  leftCard: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  rightCard: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  patternBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
    position: 'relative',
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  versionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  versionDescription: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 15,
    opacity: 0.95,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 6,
    opacity: 0.9,
    fontWeight: '500',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  selectButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rulesSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  rulesButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#666',
    color: 'white',
    borderRadius: 25,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default MainMenuScreen;