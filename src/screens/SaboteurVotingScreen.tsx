import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GameConfig } from '../types';
import Button from '../components/Button';

type RootStackParamList = {
  SaboteurVoting: { gameConfig: GameConfig; onVoteComplete: () => void };
};

type SaboteurVotingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SaboteurVoting'>;
type SaboteurVotingScreenRouteProp = RouteProp<RootStackParamList, 'SaboteurVoting'>;

interface Props {
  navigation: SaboteurVotingScreenNavigationProp;
  route: SaboteurVotingScreenRouteProp;
}

const SaboteurVotingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameConfig, onVoteComplete } = route.params;
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [votingResult, setVotingResult] = useState<{isSaboteur: boolean; playerName: string} | null>(null);

  const handleVote = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handleConfirmVote = () => {
    if (!selectedPlayer) return;

    const votedPlayer = gameConfig.players.find(p => p.id === selectedPlayer);
    const isSaboteur = votedPlayer?.role === 'saboteur';

    // Setze das Ergebnis und zeige das Modal
    setVotingResult({
      isSaboteur,
      playerName: votedPlayer?.name || ''
    });
    setShowResultModal(true);
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    onVoteComplete();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saboteur-Abstimmung</Text>
      
      <Text style={styles.instruction}>
        Verdächtigt jemanden, der Saboteur zu sein!{'\n'}
        Gemeinsam entscheidet ihr, wer abgewählt wird.
      </Text>

      <ScrollView style={styles.playersContainer}>
        {gameConfig.players
          .filter(player => player.role !== 'detective')
          .map(player => (
            <View key={player.id} style={styles.playerButtonContainer}>
              <Button
                title={player.name}
                onPress={() => handleVote(player.id)}
                color={selectedPlayer === player.id ? "#c66b3d" : "#26495c"}
                size="large"
              />
            </View>
          ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Abstimmung bestätigen"
          onPress={handleConfirmVote}
          disabled={!selectedPlayer}
          color="#c66b3d"
          size="large"
        />
      </View>

      {/* Custom Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseResult}
      >
        <TouchableWithoutFeedback onPress={handleCloseResult}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.resultModal}>
                <Text style={styles.resultIcon}>
                  {votingResult?.isSaboteur ? '🎉' : '❌'}
                </Text>
                <Text style={styles.resultTitle}>
                  {votingResult?.isSaboteur ? 'Saboteur entlarvt!' : 'Falscher Verdacht'}
                </Text>
                <Text style={styles.resultText}>
                  {votingResult?.isSaboteur 
                    ? `${votingResult.playerName} war tatsächlich der Saboteur! Er/sie ist jetzt raus.`
                    : `${votingResult?.playerName} war nicht der Saboteur. Weiter spielen!`
                  }
                </Text>
                <View style={styles.modalButtonContainer}>
                  <Button 
                    title="OK" 
                    onPress={handleCloseResult}
                    color="#c66b3d"
                    size="medium"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5e5dc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#26495c',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  playersContainer: {
    flex: 1,
    marginBottom: 20,
  },
  playerButtonContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  // NEU: Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultModal: {
    backgroundColor: '#26495c',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#c4a35a',
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c4a35a',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#e5e5dc',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default SaboteurVotingScreen;