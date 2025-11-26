// adults/src/utils/roleRotation.ts - VOLLSTÄNDIG KORRIGIERT
import { 
  AdultsPlayer, 
  AdultsGameConfig, 
  GameMode, 
  ChaosRule, 
  RoleStatistics, 
  DrinkingStats, 
  RotationConfig,
  DetectiveRotation,
  AdultsRole
} from '../types';

// 🎯 ADULTS-SPEZIFISCHE ROTATIONS-KONFIGURATION
const DEFAULT_ROTATION_CONFIG: RotationConfig = {
  enableFairRotation: true,
  maxConsecutiveDetective: 2,
  considerDrinkingLevel: true,
  chaosRuleInfluence: true,
  randomFactor: 0.3
};

/**
 * 🎯 Initialisiert Rollen für die erste Runde mit Adults-spezifischen Features
 */
export const initializeRoles = (
  playerNames: string[],
  gameMode: GameMode,
  activeChaosRules: ChaosRule[]
): AdultsGameConfig => {
  // Zufällige Auswahl des ersten Detektivs
  const firstDetectiveIndex = Math.floor(Math.random() * playerNames.length);
  
  const players: AdultsPlayer[] = playerNames.map((name, index) => {
    const isDetective = index === firstDetectiveIndex;
    const role: AdultsRole = isDetective ? 'detective' : 'actor';
    
    return {
      id: `player-${Date.now()}-${index}`,
      name,
      role: role,
      instruction: '',
      drinks: 0,
      chaosRuleViolations: 0,
      hasBeenDetective: isDetective,
      detectiveCount: isDetective ? 1 : 0,
      lastRole: role
    };
  });

  // Initialisiere Player Scores mit Trink-Integration
  const playerScores = players.map(player => ({
    playerId: player.id,
    playerName: player.name,
    score: 0,
    drinks: 0
  }));

  // Bestimme Rundenzahl basierend auf Spielmodus
  let totalRounds = 1;
  if (gameMode === 'bo3') totalRounds = 3;
  if (gameMode === 'bo5') totalRounds = 5;

  const gameConfig: AdultsGameConfig = {
    players,
    detective: players[firstDetectiveIndex],
    instruction: '',
    gameMode,
    currentRound: 1,
    totalRounds,
    playerScores,
    saboteurCount: 0,
    activeChaosRules,
    totalDrinks: 0,
    usedDetectives: [players[firstDetectiveIndex].name],
    roleRotationEnabled: totalRounds > 1,
    nextDetectiveIndex: -1
  };

  return gameConfig;
};

/**
 * 🎯 Rotiert Rollen für die nächste Runde mit Adults-spezifischer Logik
 */
export const rotateRolesForNextRound = (currentConfig: AdultsGameConfig): AdultsGameConfig => {
  // Wenn Single-Round Modus oder letzte Runde, keine Rotation
  if (currentConfig.gameMode === 'single' || currentConfig.currentRound >= currentConfig.totalRounds) {
    return currentConfig;
  }

  const nextRound = currentConfig.currentRound + 1;
  const players = [...currentConfig.players];
  const usedDetectives = [...(currentConfig.usedDetectives || [])];

  // 🎯 Berechne nächsten Detektiv mit Adults-spezifischer Gewichtung
  const nextDetectiveIndex = calculateNextDetective(players, usedDetectives);
  const newDetective = players[nextDetectiveIndex];

  // Aktualisiere Rollen mit expliziten Typen
  const updatedPlayers: AdultsPlayer[] = players.map((player, index) => {
    const isNewDetective = index === nextDetectiveIndex;
    const newRole: AdultsRole = isNewDetective ? 'detective' : 'actor';
    
    return {
      ...player,
      role: newRole,
      lastRole: player.role,
      hasBeenDetective: player.hasBeenDetective || isNewDetective,
      detectiveCount: (player.detectiveCount || 0) + (isNewDetective ? 1 : 0)
    };
  });

  // Füge neuen Detektiv zur Used-Liste hinzu
  usedDetectives.push(newDetective.name);

  // 🎯 BEHALTE CHAOS-REGELN & TRINK-STATISTIKEN
  const updatedConfig: AdultsGameConfig = {
    ...currentConfig,
    players: updatedPlayers,
    detective: updatedPlayers[nextDetectiveIndex],
    currentRound: nextRound,
    usedDetectives,
    nextDetectiveIndex,
    activeChaosRules: currentConfig.activeChaosRules,
    totalDrinks: currentConfig.totalDrinks,
    playerScores: currentConfig.playerScores
  };

  return updatedConfig;
};

/**
 * 🎯 Berechnet nächsten Detektiv mit Adults-spezifischer Gewichtung
 */
export const calculateNextDetective = (players: AdultsPlayer[], usedDetectives: string[]): number => {
  const eligiblePlayers = players
    .map((player, index) => ({ player, index }))
    .filter(({ player }) => {
      const maxConsecutive = DEFAULT_ROTATION_CONFIG.maxConsecutiveDetective;
      const recentUses = usedDetectives.filter(name => name === player.name).length;
      
      return recentUses < maxConsecutive;
    });

  if (eligiblePlayers.length === 0) {
    return Math.floor(Math.random() * players.length);
  }

  // 🎯 Adults-spezifische Gewichtung
  const weights = eligiblePlayers.map(({ player, index }) => {
    let weight = 1.0;
    
    // Höhere Gewichtung für Spieler, die noch nie/selten Detektiv waren
    const detectiveCount = player.detectiveCount || 0;
    weight += (1 - detectiveCount / players.length) * 2;
    
    // 🎯 Berücksichtige Trink-Level für "lustige" Verteilung
    if (DEFAULT_ROTATION_CONFIG.considerDrinkingLevel) {
      const drinkingBonus = Math.min(player.drinks / 10, 1.0);
      weight += drinkingBonus * 0.5;
    }
    
    // 🎯 Zufallsfaktor für Party-Spaß
    weight += Math.random() * DEFAULT_ROTATION_CONFIG.randomFactor;
    
    return { index, weight };
  });

  weights.sort((a, b) => b.weight - a.weight);
  return weights[0].index;
};

/**
 * 🎯 Setzt Rollen für komplett neues Spiel zurück
 */
export const resetRolesForNewGame = (
  playerNames: string[],
  gameMode: GameMode,
  activeChaosRules: ChaosRule[]
): AdultsGameConfig => {
  return initializeRoles(playerNames, gameMode, activeChaosRules);
};

/**
 * 🎯 Gibt detaillierte Rollen-Statistiken zurück
 */
export const getRoleStatistics = (gameConfig: AdultsGameConfig): RoleStatistics => {
  const detectiveRotation: DetectiveRotation[] = gameConfig.usedDetectives?.map((name, index) => {
    const player = gameConfig.players.find(p => p.name === name);
    return {
      round: index + 1,
      detectiveName: name,
      detectiveId: player?.id || '',
      drinksConsumed: player?.drinks || 0,
      chaosViolations: player?.chaosRuleViolations || 0
    };
  }) || [];

  const drinkingStats = getDrinkingStatistics(gameConfig);

  return {
    totalRounds: gameConfig.totalRounds,
    currentRound: gameConfig.currentRound,
    detectiveRotation,
    drinkingStats,
    chaosRuleActivations: gameConfig.activeChaosRules.length
  };
};

/**
 * 🎯 Gibt Trink-Statistiken für Adults Version zurück
 */
export const getDrinkingStatistics = (gameConfig: AdultsGameConfig): DrinkingStats => {
  const playerStats = gameConfig.players.map(player => ({
    playerName: player.name,
    drinks: player.drinks,
    chaosViolations: player.chaosRuleViolations || 0
  }));

  const totalDrinks = gameConfig.totalDrinks;
  const shots = gameConfig.players.reduce((sum, player) => sum + (player.drinks || 0), 0);
  const mostDrinksPlayer = playerStats.reduce((max, player) => 
    player.drinks > max.drinks ? player : max, 
    { playerName: '', drinks: 0, chaosViolations: 0 }
  );

  return {
    totalDrinks,
    shots,
    sips: totalDrinks - shots,
    socialDrinks: Math.floor(totalDrinks / 3),
    mostDrinksPlayer: mostDrinksPlayer.playerName,
    mostDrinksCount: mostDrinksPlayer.drinks
  };
};

/**
 * 🎯 Prüft Chaos-Regeln die Rollen-Wechsel betreffen - KORRIGIERT
 */
export const checkChaosRuleForRoleChange = (
  gameConfig: AdultsGameConfig,
  oldDetective: AdultsPlayer,
  newDetective: AdultsPlayer
): string[] => {
  const effects: string[] = [];
  
  gameConfig.activeChaosRules.forEach(rule => {
    // 🟢 KORRIGIERT: Verwende 'random' Trigger statt nicht-existentem 'role_change'
    if (rule.trigger === 'random') {
      effects.push(`🎭 ${rule.name}: ${rule.description}`);
    }
    
    if (rule.id === 'whisper_mode') {
      effects.push('🤫 Flüstermodus: Denkt daran leise zu sprechen bei der Rollen-Enthüllung!');
    }
  });
  
  return effects;
};

/**
 * 🎯 Berechnet Party-Score (Kombination aus Punkten + Trink-Aktivität)
 */
export const calculatePartyScore = (gameConfig: AdultsGameConfig): number => {
  const pointsScore = gameConfig.playerScores.reduce((sum, score) => sum + score.score, 0);
  const drinkingScore = gameConfig.totalDrinks * 0.1;
  const chaosScore = gameConfig.activeChaosRules.length * 0.5;
  
  return Math.round(pointsScore + drinkingScore + chaosScore);
};

export default {
  initializeRoles,
  rotateRolesForNextRound,
  resetRolesForNewGame,
  getRoleStatistics,
  getDrinkingStatistics,
  calculateNextDetective,
  checkChaosRuleForRoleChange,
  calculatePartyScore
};