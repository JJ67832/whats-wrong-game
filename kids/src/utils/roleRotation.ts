// kids/src/utils/roleRotation.ts
// 🆕 KIDS-SPEZIFISCHE VERSION - OHNE ADULTS-TYPEN

import { Player, GameConfig, GameMode } from '../types';

/**
 * Rotiert die Rollen für die nächste Runde - KIDS VERSION
 * Stellt sicher, dass jeder Spieler mal Detektiv ist
 */
export function rotateRolesForNextRound(currentConfig: GameConfig): GameConfig {
  const { players, currentRound, totalRounds, usedDetectives = [] } = currentConfig;
  
  // Wenn nur eine Runde oder alle schon Detektiv waren, zurücksetzen
  if (currentRound >= totalRounds || usedDetectives.length >= players.length) {
    return resetRoles(currentConfig);
  }

  // Finde Spieler, die noch NICHT Detektiv waren
  const availableDetectives = players.filter(player => 
    !usedDetectives.includes(player.id)
  );

  // Wenn keine verfügbaren Detektive mehr, zurücksetzen
  if (availableDetectives.length === 0) {
    return resetRoles(currentConfig);
  }

  // Wähle zufälligen neuen Detektiv aus verfügbaren Spielern
  const newDetectiveIndex = Math.floor(Math.random() * availableDetectives.length);
  const newDetective = availableDetectives[newDetectiveIndex];

  // Aktualisiere usedDetectives
  const newUsedDetectives = [...usedDetectives, newDetective.id];

  // Aktualisiere alle Spieler-Rollen - KIDS VERSION (kein saboteur)
  const updatedPlayers = players.map(player => {
    if (player.id === newDetective.id) {
      return { 
        ...player, 
        role: 'detective' as const,
        hasBeenDetective: true,
        detectiveCount: (player.detectiveCount || 0) + 1
      };
    } else {
      return { 
        ...player, 
        role: 'actor' as const,
        instruction: currentConfig.instruction
      };
    }
  });

  // Rückgabe der aktualisierten Konfiguration
  return {
    ...currentConfig,
    players: updatedPlayers,
    detective: { ...newDetective, role: 'detective' },
    currentRound: currentRound + 1,
    usedDetectives: newUsedDetectives
  };
}

/**
 * Setzt die Rollen-Verteilung zurück (für neue Spiele) - KIDS VERSION
 */
export function resetRoles(config: GameConfig): GameConfig {
  const { players } = config;
  
  // Wähle zufälligen Start-Detektiv
  const randomIndex = Math.floor(Math.random() * players.length);
  const startDetective = players[randomIndex];

  const resetPlayers = players.map((player) => {
    if (player.id === startDetective.id) {
      return { 
        ...player, 
        role: 'detective' as const,
        hasBeenDetective: true,
        detectiveCount: 1
      };
    } else {
      return { 
        ...player, 
        role: 'actor' as const,
        instruction: config.instruction
      };
    }
  });

  return {
    ...config,
    players: resetPlayers,
    detective: { ...startDetective, role: 'detective' },
    currentRound: 1,
    usedDetectives: [startDetective.id]
  };
}

/**
 * Initialisiert die Rollen für ein neues Spiel - KIDS VERSION
 */
export function initializeRoles(players: Player[], instruction: string, gameMode: GameMode): GameConfig {
  const totalRounds = gameMode === 'single' ? 1 : gameMode === 'bo3' ? 3 : 5;
  
  // Wähle zufälligen Start-Detektiv
  const randomIndex = Math.floor(Math.random() * players.length);
  const startDetective = players[randomIndex];

  const initializedPlayers = players.map((player) => {
    if (player.id === startDetective.id) {
      return { 
        ...player, 
        role: 'detective' as const,
        hasBeenDetective: true,
        detectiveCount: 1
      };
    } else {
      return { 
        ...player, 
        role: 'actor' as const,
        instruction: instruction
      };
    }
  });

  return {
    players: initializedPlayers,
    detective: { ...startDetective, role: 'detective' },
    instruction: instruction,
    gameMode: gameMode,
    currentRound: 1,
    totalRounds: totalRounds,
    playerScores: players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      score: 0
    })),
    usedDetectives: [startDetective.id]
  };
}