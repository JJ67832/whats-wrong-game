// src/utils/roleRotation.ts
// ✅ VOLLSTÄNDIG KORRIGIERT: Alle TypeScript-Fehler behoben

import { Player, GameConfig, GameMode } from '../types';

/**
 * Rotiert die Rollen für die nächste Runde - CLASSIC VERSION
 * Zufällige Verteilung mit Tendenz zur Fairness
 */
export function rotateRolesForNextRound(currentConfig: GameConfig): GameConfig {
  const { players, currentRound, totalRounds, usedDetectives = [], saboteurCount } = currentConfig;
  
  // Wenn Spiel vorbei, nichts ändern
  if (currentRound >= totalRounds) {
    return currentConfig;
  }

  // ✅ KORRIGIERT: TypeScript-Fehler behoben mit type assertion
  const availablePlayers = players.filter(player => 
    (player.role as string) !== 'saboteur' // Saboteure können nicht Detektiv werden
  );

  if (availablePlayers.length === 0) {
    console.warn('Keine verfügbaren Spieler für Detektiv-Rolle');
    return currentConfig;
  }

  // 🔄 VERBESSERTE ZUFÄLLIGKEIT MIT FAIRNESS-TENDENZ
  // Gewichte Spieler basierend auf wie oft sie schon Detektiv waren
  const weightedPlayers = availablePlayers.map(player => {
    const detectiveCount = player.detectiveCount || 0;
    const baseWeight = 100;
    
    // Reduziere Gewichtung basierend auf Detektiv-Einsätzen
    // Aber nicht zu stark, um Zufälligkeit zu erhalten
    const weightReduction = Math.min(detectiveCount * 15, 60); // Max 60% Reduktion
    const finalWeight = baseWeight - weightReduction;
    
    return {
      player,
      weight: Math.max(finalWeight, 40) // Mindestgewicht von 40%
    };
  });

  // Wähle zufälligen Spieler basierend auf Gewichtung
  const totalWeight = weightedPlayers.reduce((sum, wp) => sum + wp.weight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedPlayer: Player | null = null;
  for (const weightedPlayer of weightedPlayers) {
    random -= weightedPlayer.weight;
    if (random <= 0) {
      selectedPlayer = weightedPlayer.player;
      break;
    }
  }

  // Fallback: Ersten verfügbaren Spieler nehmen
  if (!selectedPlayer) {
    selectedPlayer = availablePlayers[0];
  }

  // Aktualisiere usedDetectives
  const newUsedDetectives = [...usedDetectives, selectedPlayer.id];

  // 🔄 AKTUALISIERE ALLE SPIELER-ROLLEN
  const updatedPlayers = players.map(player => {
    if (player.id === selectedPlayer!.id) {
      // Neuer Detektiv
      return { 
        ...player, 
        role: 'detective' as const,
        hasBeenDetective: true,
        detectiveCount: (player.detectiveCount || 0) + 1,
        instruction: undefined // Detektiv hat keine Instruction
      };
    } else if (player.role === 'detective') {
      // Vorheriger Detektiv wird zum Actor (wenn nicht Saboteur)
      // ✅ KORRIGIERT: TypeScript-Fehler behoben
      if ((player.role as string) !== 'saboteur') {
        return { 
          ...player, 
          role: 'actor' as const,
          instruction: currentConfig.instruction
        };
      }
      return player;
    } else if (player.role === 'saboteur') {
      // Saboteur bleibt Saboteur
      return player;
    } else {
      // Actor bleibt Actor
      return { 
        ...player, 
        instruction: currentConfig.instruction 
      };
    }
  });

  return {
    ...currentConfig,
    players: updatedPlayers,
    detective: { ...selectedPlayer, role: 'detective' },
    currentRound: currentRound + 1,
    usedDetectives: newUsedDetectives
  };
}

/**
 * Setzt die Rollen-Verteilung zurück (für neue Spiele) - CLASSIC VERSION
 */
export function resetRoles(config: GameConfig): GameConfig {
  const { players, saboteurCount } = config;
  
  // ✅ KORRIGIERT: TypeScript-Fehler behoben
  const nonSaboteurPlayers = players.filter(player => 
    (player.role as string) !== 'saboteur'
  );
  
  if (nonSaboteurPlayers.length === 0) {
    console.warn('Keine nicht-Saboteur Spieler gefunden für Detektiv-Rolle');
    return config;
  }
  
  const randomIndex = Math.floor(Math.random() * nonSaboteurPlayers.length);
  const startDetective = nonSaboteurPlayers[randomIndex];

  const resetPlayers = players.map((player) => {
    if (player.id === startDetective.id) {
      return { 
        ...player, 
        role: 'detective' as const,
        hasBeenDetective: true,
        detectiveCount: 1
      };
    } else if (player.role === 'saboteur') {
      // Saboteur bleibt Saboteur
      return player;
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
 * Initialisiert die Rollen für ein neues Spiel - CLASSIC VERSION
 * Mit Saboteur-Unterstützung
 */
export function initializeRoles(
  players: Player[], 
  instruction: string, 
  gameMode: GameMode, 
  saboteurCount: number
): GameConfig {
  const totalRounds = gameMode === 'single' ? 1 : 
                     gameMode === 'bo3' ? 3 : 
                     gameMode === 'bo5' ? 5 : 
                     gameMode === 'bo7' ? 7 : 10;
  
  // ✅ KORRIGIERT: TypeScript-Fehler behoben
  const nonSaboteurPlayers = players.filter(player => 
    (player.role as string) !== 'saboteur'
  );
  
  if (nonSaboteurPlayers.length === 0) {
    console.warn('Keine nicht-Saboteur Spieler für Detektiv-Rolle verfügbar');
    // Fallback: Ersten Spieler nehmen
    const startDetective = players[0];
    const initializedPlayers = players.map((player, index) => ({
      ...player,
      role: index === 0 ? 'detective' as const : 'actor' as const,
      instruction: index === 0 ? undefined : instruction,
      hasBeenDetective: index === 0,
      detectiveCount: index === 0 ? 1 : 0
    }));

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
      saboteurCount: saboteurCount,
      usedDetectives: [startDetective.id]
    };
  }

  const randomIndex = Math.floor(Math.random() * nonSaboteurPlayers.length);
  const startDetective = nonSaboteurPlayers[randomIndex];

  // Weise Saboteure zu (falls gewünscht)
  let playersWithRoles = [...players];
  
  if (saboteurCount > 0 && players.length >= 5) {
    const availableSaboteurs = players.filter(p => p.id !== startDetective.id);
    const shuffled = [...availableSaboteurs].sort(() => 0.5 - Math.random());
    const saboteurs = shuffled.slice(0, saboteurCount);
    
    playersWithRoles = playersWithRoles.map(player => {
      if (saboteurs.some(s => s.id === player.id)) {
        return { ...player, role: 'saboteur' as const };
      } else if (player.id === startDetective.id) {
        return { ...player, role: 'detective' as const };
      } else {
        return { ...player, role: 'actor' as const };
      }
    });
  } else {
    // Kein Saboteur-Modus
    playersWithRoles = playersWithRoles.map(player => {
      if (player.id === startDetective.id) {
        return { ...player, role: 'detective' as const };
      } else {
        return { ...player, role: 'actor' as const };
      }
    });
  }

  // ✅ KORRIGIERT: TypeScript-Fehler behoben mit Hilfsfunktionen
  // Setze Instructions für Actors und Saboteure
  const finalizedPlayers = playersWithRoles.map(player => {
    const isDetectiveRole = (player.role as string) === 'detective';
    
    if (player.role === 'actor' || player.role === 'saboteur') {
      return { 
        ...player, 
        instruction,
        hasBeenDetective: isDetectiveRole,
        detectiveCount: isDetectiveRole ? 1 : 0
      };
    }
    return { 
      ...player, 
      hasBeenDetective: true,
      detectiveCount: 1
    };
  });

  return {
    players: finalizedPlayers,
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
    saboteurCount: saboteurCount,
    usedDetectives: [startDetective.id]
  };
}

/**
 * Gibt Statistiken zur Rollen-Verteilung zurück
 */
export function getRoleStatistics(players: Player[]): {
  totalDetectiveRounds: number;
  playerStats: Array<{
    player: Player;
    detectiveCount: number;
  }>;
} {
  const playerStats = players.map(player => ({
    player,
    detectiveCount: player.detectiveCount || 0
  }));

  const totalDetectiveRounds = playerStats.reduce((sum, stat) => sum + stat.detectiveCount, 0);

  return {
    totalDetectiveRounds,
    playerStats: playerStats.sort((a, b) => b.detectiveCount - a.detectiveCount)
  };
}

/**
 * Hilfsfunktion: Prüft ob ein Spieler ein Saboteur ist
 */
export function isSaboteur(player: Player): boolean {
  return (player.role as string) === 'saboteur';
}

/**
 * Hilfsfunktion: Prüft ob ein Spieler ein Detektiv ist
 */
export function isDetective(player: Player): boolean {
  return (player.role as string) === 'detective';
}

/**
 * Hilfsfunktion: Prüft ob ein Spieler ein Actor ist
 */
export function isActor(player: Player): boolean {
  return (player.role as string) === 'actor';
}

/**
 * Hilfsfunktion: Prüft die Rolle eines Spielers (sicher für TypeScript)
 */
export function checkPlayerRole(player: Player, role: string): boolean {
  return (player.role as string) === role;
}