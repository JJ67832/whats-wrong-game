// adults/src/utils/drinkingGame.ts - VOLLSTÄNDIG KORRIGIERTE VERSION
import { ChaosRule, Player, PlayerScore } from '../types';

export interface DrinkingAction {
  playerName: string;
  action: string;
  amount: number;
  type: 'sip' | 'shot';
  success: boolean;
}

export interface DrinkingPenaltyResult {
  action: DrinkingAction;
  updatedPlayers: Player[];
  updatedScores: PlayerScore[];
  totalDrinksAdded: number;
  message: string;
}

// 🆕 Hilfsfunktion zum Konvertieren der Drink-Typen
const convertDrinkType = (type: 'sip' | 'shot' | 'social' | 'custom'): 'sip' | 'shot' => {
  if (type === 'sip' || type === 'shot') {
    return type;
  }
  // Konvertiere 'social' und 'custom' zu 'sip' als Fallback
  return 'sip';
};

// 🆕 Hilfsfunktion zum Konvertieren der Target-Typen
const convertTargetType = (target: 'player' | 'all' | 'team' | 'random' | 'detective'): 'all' | 'detective' | 'all_except_detective' => {
  switch (target) {
    case 'all':
      return 'all';
    case 'detective':
      return 'detective';
    case 'player':
    case 'random':
    case 'team':
    default:
      // Für 'player', 'random', 'team' wählen wir zufällig zwischen detective und all_except_detective
      return Math.random() > 0.5 ? 'detective' : 'all_except_detective';
  }
};

export const executeDrinkingAction = (
  rule: ChaosRule,
  players: Player[],
  detective: Player,
  currentPlayerScores: PlayerScore[]
): DrinkingAction => {
  const { amount, target } = rule.drinkingAction;
  const type = convertDrinkType(rule.drinkingAction.type);
  const convertedTarget = convertTargetType(target); // 🆕 Target-Konvertierung
  
  let targetPlayer: Player | undefined;
  let targetPlayerScores: PlayerScore | undefined;
  let success = true;
  
  switch (convertedTarget) { // 🆕 Verwende konvertiertes Target
    case 'detective':
      targetPlayer = detective;
      targetPlayerScores = currentPlayerScores.find(p => p.playerId === detective.id);
      break;
    case 'all':
      // Erhöhe bei allen Spielern den Drink-Counter
      currentPlayerScores.forEach(score => {
        score.drinks += amount;
      });
      players.forEach(player => {
        player.drinks += amount;
      });
      return {
        playerName: 'ALLE SPIELER',
        action: `Social! ${amount} ${type === 'sip' ? 'Schluck(e)' : 'Shot(s)'}`,
        amount,
        type,
        success: true
      };
    case 'all_except_detective':
      // Alle außer Detektiv
      const nonDetectivePlayers = players.filter(p => p.id !== detective.id);
      const randomIndex = Math.floor(Math.random() * nonDetectivePlayers.length);
      targetPlayer = nonDetectivePlayers[randomIndex];
      targetPlayerScores = currentPlayerScores.find(p => p.playerId === targetPlayer!.id);
      break;
    default:
      // Fallback: zufälliger Spieler
      const fallbackIndex = Math.floor(Math.random() * players.length);
      targetPlayer = players[fallbackIndex];
      targetPlayerScores = currentPlayerScores.find(p => p.playerId === targetPlayer!.id);
  }
  
  if (targetPlayerScores && targetPlayer) {
    targetPlayerScores.drinks += amount;
    targetPlayer.drinks += amount;
  } else {
    success = false;
    console.warn('Drinking action failed: Target player or score not found');
  }
  
  return {
    playerName: targetPlayer?.name || 'Unbekannt',
    action: `${amount} ${type === 'sip' ? 'Schluck(e)' : 'Shot(s)'}`,
    amount,
    type,
    success
  };
};

// 🆕 NEUE FUNKTION: Allgemeine Trink-Strafen für Spielergebnisse
export const executeGeneralDrinkingPenalty = (
  target: 'detective' | 'all_except_detective' | 'all',
  amount: number,
  type: 'sip' | 'shot',
  players: Player[],
  currentPlayerScores: PlayerScore[]
): DrinkingPenaltyResult => {
  const updatedPlayers = [...players];
  const updatedScores = [...currentPlayerScores];
  let totalDrinksAdded = 0;
  let affectedPlayers: string[] = [];
  let message = '';

  if (target === 'all_except_detective') {
    // Alle außer Detektiv trinken (Detektiv gewinnt)
    updatedScores.forEach(score => {
      const player = updatedPlayers.find(p => p.id === score.playerId);
      if (player && player.role !== 'detective') {
        score.drinks += amount;
        player.drinks += amount;
        totalDrinksAdded += amount;
        affectedPlayers.push(player.name);
      }
    });
    message = `🍻 DETEKTIV GEWINNT! Alle anderen trinken ${amount} ${type === 'sip' ? 'Schluck' : 'Shot'}${amount > 1 ? 'e' : ''}!`;
  } 
  else if (target === 'detective') {
    // Nur Detektiv trinkt (Detektiv verliert)
    updatedScores.forEach(score => {
      const player = updatedPlayers.find(p => p.id === score.playerId);
      if (player && player.role === 'detective') {
        score.drinks += amount;
        player.drinks += amount;
        totalDrinksAdded += amount;
        affectedPlayers.push(player.name);
      }
    });
    const detective = updatedPlayers.find(p => p.role === 'detective');
    message = `🍻 DETEKTIV VERLIERT! ${detective?.name} trinkt ${amount} ${type === 'sip' ? 'Schluck' : 'Shot'}${amount > 1 ? 'e' : ''}!`;
  }
  else if (target === 'all') {
    // Alle trinken (z.B. für Social-Events)
    updatedScores.forEach(score => {
      const player = updatedPlayers.find(p => p.id === score.playerId);
      if (player) {
        score.drinks += amount;
        player.drinks += amount;
        totalDrinksAdded += amount;
        affectedPlayers.push(player.name);
      }
    });
    message = `🍻 SOCIAL! Alle trinken ${amount} ${type === 'sip' ? 'Schluck' : 'Shot'}${amount > 1 ? 'e' : ''}!`;
  }

  const action: DrinkingAction = {
    playerName: affectedPlayers.length === 1 ? affectedPlayers[0] : 'MEHRERE SPIELER',
    action: `${amount} ${type === 'sip' ? 'Schluck(e)' : 'Shot(s)'}`,
    amount,
    type,
    success: true
  };

  return {
    action,
    updatedPlayers,
    updatedScores,
    totalDrinksAdded,
    message
  };
};

// 🆕 NEUE FUNKTION: Automatische Trink-Strafen bei Spielende
export const applyGameResultDrinking = (
  gameConfig: { players: Player[]; playerScores: PlayerScore[]; detective: Player; totalDrinks: number },
  detectiveWon: boolean
): { updatedPlayers: Player[]; updatedScores: PlayerScore[]; totalDrinks: number; message: string } => {
  const penaltyResult = executeGeneralDrinkingPenalty(
    detectiveWon ? 'all_except_detective' : 'detective',
    3, // Immer 3 Schlucke bei Spielende
    'sip',
    gameConfig.players,
    gameConfig.playerScores
  );

  return {
    updatedPlayers: penaltyResult.updatedPlayers,
    updatedScores: penaltyResult.updatedScores,
    totalDrinks: gameConfig.totalDrinks + penaltyResult.totalDrinksAdded,
    message: penaltyResult.message
  };
};

// 🆕 NEUE FUNKTION: Roulette-Trink-Aktion
export const executeRouletteDrinking = (
  result: { drinks: number; type: 'sip' | 'shot'; target: 'player' | 'all' | 'random' },
  players: Player[],
  currentPlayerScores: PlayerScore[]
): DrinkingPenaltyResult => {
  // 🆕 Konvertiere das Roulette-Target zu einem kompatiblen Target
  let compatibleTarget: 'all' | 'detective' | 'all_except_detective';
  
  if (result.target === 'all') {
    compatibleTarget = 'all';
  } else {
    // Für 'player' und 'random' wählen wir zufällig zwischen detective und all_except_detective
    compatibleTarget = Math.random() > 0.5 ? 'detective' : 'all_except_detective';
  }

  const penaltyResult = executeGeneralDrinkingPenalty(
    compatibleTarget,
    result.drinks,
    result.type,
    players,
    currentPlayerScores
  );

  // Angepasste Nachricht für Roulette
  penaltyResult.message = `🎲 ROULETTE: ${penaltyResult.message}`;

  return penaltyResult;
};

// 🆕 NEUE FUNKTION: Chaos-Regel Verstoß-Strafe
export const executeChaosRuleViolation = (
  rule: ChaosRule,
  violatingPlayer: Player,
  players: Player[],
  currentPlayerScores: PlayerScore[]
): DrinkingPenaltyResult => {
  const { amount } = rule.drinkingAction;
  const type = convertDrinkType(rule.drinkingAction.type);
  
  // Finde den Spieler in den Scores
  const playerScore = currentPlayerScores.find(p => p.playerId === violatingPlayer.id);
  const updatedPlayers = [...players];
  const updatedScores = [...currentPlayerScores];
  let totalDrinksAdded = 0;

  if (playerScore) {
    playerScore.drinks += amount;
    const player = updatedPlayers.find(p => p.id === violatingPlayer.id);
    if (player) {
      player.drinks += amount;
    }
    totalDrinksAdded += amount;
  }

  const action: DrinkingAction = {
    playerName: violatingPlayer.name,
    action: `Chaos-Regel verletzt: ${amount} ${type === 'sip' ? 'Schluck(e)' : 'Shot(s)'}`,
    amount,
    type,
    success: true
  };

  return {
    action,
    updatedPlayers,
    updatedScores,
    totalDrinksAdded,
    message: `🎭 ${rule.name} verletzt! ${violatingPlayer.name} trinkt ${amount} ${type === 'sip' ? 'Schluck' : 'Shot'}${amount > 1 ? 'e' : ''}!`
  };
};

// 🆕 NEUE FUNKTION: Getränke-Statistiken
export const getDrinkingStatistics = (playerScores: PlayerScore[]) => {
  const totalDrinks = playerScores.reduce((sum, score) => sum + (score.drinks || 0), 0);
  const averageDrinks = totalDrinks / playerScores.length;
  const topDrinker = playerScores.reduce((top, score) => 
    (score.drinks || 0) > (top.drinks || 0) ? score : top
  );
  const soberPlayers = playerScores.filter(score => (score.drinks || 0) === 0).length;

  return {
    totalDrinks,
    averageDrinks: Math.round(averageDrinks * 10) / 10,
    topDrinker: {
      name: topDrinker.playerName,
      drinks: topDrinker.drinks || 0
    },
    soberPlayers,
    drinkingLevel: totalDrinks < 10 ? 'LEICHT' : totalDrinks < 25 ? 'MODERAT' : 'STARK'
  };
};

// 🆕 NEUE FUNKTION: Trunkenheits-Level
export const getDrunkennessLevel = (drinks: number): { level: string; emoji: string; color: string } => {
  if (drinks === 0) {
    return { level: 'Nüchtern', emoji: '🥤', color: '#4CAF50' };
  } else if (drinks <= 3) {
    return { level: 'Angetrunken', emoji: '🍺', color: '#8BC34A' };
  } else if (drinks <= 6) {
    return { level: 'Beschwipst', emoji: '🥴', color: '#FFC107' };
  } else if (drinks <= 9) {
    return { level: 'Betrunken', emoji: '😵', color: '#FF9800' };
  } else if (drinks <= 12) {
    return { level: 'Volltrunken', emoji: '🤪', color: '#FF5722' };
  } else {
    return { level: 'Blackout', emoji: '💀', color: '#F44336' };
  }
};

// 🆕 NEUE FUNKTION: Reset Getränke-Status
export const resetDrinkingStatus = (players: Player[], playerScores: PlayerScore[]) => {
  const resetPlayers = players.map(player => ({
    ...player,
    drinks: 0
  }));
  
  const resetScores = playerScores.map(score => ({
    ...score,
    drinks: 0
  }));

  return {
    resetPlayers,
    resetScores,
    message: '🍻 Getränke-Status wurde zurückgesetzt!'
  };
};

// 🆕 NEUE FUNKTION: Spezielle Trink-Herausforderungen
export const executeDrinkingChallenge = (
  challenge: 'waterfall' | 'categories' | 'never_have_i_ever' | 'most_likely',
  players: Player[],
  currentPlayerScores: PlayerScore[]
): DrinkingPenaltyResult => {
  const updatedPlayers = [...players];
  const updatedScores = [...currentPlayerScores];
  let totalDrinksAdded = 0;
  let message = '';

  switch (challenge) {
    case 'waterfall':
      // Jeder trinkt solange, bis die Person vor ihm aufhört
      updatedScores.forEach(score => {
        const drinks = 2; // Mindestanzahl für Waterfall
        score.drinks += drinks;
        const player = updatedPlayers.find(p => p.id === score.playerId);
        if (player) {
          player.drinks += drinks;
        }
        totalDrinksAdded += drinks;
      });
      message = '💦 WASSERFALL! Alle trinken mindestens 2 Schlucke!';
      break;

    case 'categories':
      // Kategorie-Spiel: Wer keine Antwort hat, trinkt
      const categories = ['Biermarken', 'Länder', 'Filme', 'Sportarten'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      message = `📚 KATEGORIEN: ${randomCategory}! Wer keine Antwort hat, trinkt 1 Shot!`;
      
      // Simuliere, dass 1-2 Spieler trinken müssen
      const drinkersCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < drinkersCount; i++) {
        const randomPlayerIndex = Math.floor(Math.random() * updatedScores.length);
        updatedScores[randomPlayerIndex].drinks += 1;
        const player = updatedPlayers.find(p => p.id === updatedScores[randomPlayerIndex].playerId);
        if (player) {
          player.drinks += 1;
        }
        totalDrinksAdded += 1;
      }
      break;

    case 'never_have_i_ever':
      // "Ich habe noch nie..." - wer es getan hat, trinkt
      const neverHaveIEverStatements = [
        'noch nie betrunken gewesen',
        'noch nie etwas gestohlen',
        'noch nie in der Öffentlichkeit getanzt',
        'noch nie einen Promi getroffen'
      ];
      const randomStatement = neverHaveIEverStatements[Math.floor(Math.random() * neverHaveIEverStatements.length)];
      message = `🙊 ICH HABE NOCH NIE: ${randomStatement}! Wer es getan hat, trinkt 1 Schluck!`;
      
      // Simuliere, dass mehrere Spieler trinken müssen
      const affectedCount = Math.floor(Math.random() * updatedScores.length) + 1;
      for (let i = 0; i < affectedCount; i++) {
        const randomPlayerIndex = Math.floor(Math.random() * updatedScores.length);
        updatedScores[randomPlayerIndex].drinks += 1;
        const player = updatedPlayers.find(p => p.id === updatedScores[randomPlayerIndex].playerId);
        if (player) {
          player.drinks += 1;
        }
        totalDrinksAdded += 1;
      }
      break;

    case 'most_likely':
      // "Wer ist am ehesten..." - die Mehrheit stimmt ab
      const mostLikelyStatements = [
        'am ehesten zu spät kommen',
        'am ehesten einen Streit anfangen',
        'am ehesten betrunken texten',
        'am ehesten einen Unfall bauen'
      ];
      const randomMostLikely = mostLikelyStatements[Math.floor(Math.random() * mostLikelyStatements.length)];
      message = `🎯 WER IST AM EHESTEN: ${randomMostLikely}? Die Mehrheit entscheidet wer trinkt!`;
      
      // Der "Verlierer" trinkt 2 Schlucke
      const loserIndex = Math.floor(Math.random() * updatedScores.length);
      updatedScores[loserIndex].drinks += 2;
      const loserPlayer = updatedPlayers.find(p => p.id === updatedScores[loserIndex].playerId);
      if (loserPlayer) {
        loserPlayer.drinks += 2;
      }
      totalDrinksAdded += 2;
      break;
  }

  const action: DrinkingAction = {
    playerName: 'MEHRERE SPIELER',
    action: 'Trink-Herausforderung',
    amount: totalDrinksAdded,
    type: 'sip', // 🆕 Immer 'sip' für Challenges
    success: true
  };

  return {
    action,
    updatedPlayers,
    updatedScores,
    totalDrinksAdded,
    message
  };
};

export const getDrinkingMessage = (action: DrinkingAction): string => {
  const emoji = action.type === 'shot' ? '🥃' : '🍺';
  if (action.success) {
    return `${emoji} ${action.playerName} trinkt ${action.action}! ${emoji}`;
  } else {
    return `❌ Trink-Aktion fehlgeschlagen für ${action.playerName}`;
  }
};

// 🆕 NEUE FUNKTION: Erweiterte Nachricht für Trink-Strafen
export const getEnhancedDrinkingMessage = (result: DrinkingPenaltyResult): string => {
  return result.message;
};

export const RUSSIAN_ROULETTE_PENALTIES = [
  { type: 'sip' as const, amount: 1, message: '1 Schluck Bier - Glück gehabt!', target: 'player' as const },
  { type: 'shot' as const, amount: 1, message: '1 Shot - Aua!', target: 'player' as const },
  { type: 'shot' as const, amount: 2, message: '2 Shots - Doppeltes Pech!', target: 'player' as const },
  { type: 'sip' as const, amount: 3, message: '3 Schlucke + Persönliche Frage!', target: 'player' as const },
  { type: 'shot' as const, amount: 3, message: '3 Shots - JACKPOT! Alle anderen trinken mit!', target: 'all' as const },
  { type: 'sip' as const, amount: 0, message: 'Immunität! Diese Runde sicher!', target: 'player' as const },
];

// 🆕 NEUE KONSTANTE: Trink-Level Beschreibungen
export const DRINKING_LEVELS = {
  SOBER: { min: 0, max: 0, name: 'Nüchtern', emoji: '🥤', color: '#4CAF50' },
  BUZZED: { min: 1, max: 3, name: 'Angetrunken', emoji: '🍺', color: '#8BC34A' },
  TIPSY: { min: 4, max: 6, name: 'Beschwipst', emoji: '🥴', color: '#FFC107' },
  DRUNK: { min: 7, max: 9, name: 'Betrunken', emoji: '😵', color: '#FF9800' },
  WASTED: { min: 10, max: 12, name: 'Volltrunken', emoji: '🤪', color: '#FF5722' },
  BLACKOUT: { min: 13, max: 999, name: 'Blackout', emoji: '💀', color: '#F44336' }
};

// 🆕 NEUE FUNKTION: Sicherheits-Check für Getränke-Konsum
export const safetyCheck = (playerScores: PlayerScore[]): { safe: boolean; warning: string | null } => {
  const totalDrinks = playerScores.reduce((sum, score) => sum + (score.drinks || 0), 0);
  const maxDrinks = Math.max(...playerScores.map(score => score.drinks || 0));

  if (maxDrinks >= 15) {
    return { 
      safe: false, 
      warning: '⚠️ ACHTUNG: Ein Spieler hat sehr viel getrunken! Bitte auf Sicherheit achten!' 
    };
  } else if (totalDrinks >= 50) {
    return { 
      safe: false, 
      warning: '⚠️ ACHTUNG: Insgesamt wurde sehr viel getrunken! Vielleicht eine Pause einlegen?' 
    };
  } else if (maxDrinks >= 10) {
    return { 
      safe: true, 
      warning: '💡 ERINNERUNG: Bitte trinkt verantwortungsvoll und bleibt sicher!' 
    };
  }

  return { safe: true, warning: null };
};