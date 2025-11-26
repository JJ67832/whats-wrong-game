// src/types/index.ts
// ✅ VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation Tracking

export interface Player {
  id: string;
  name: string;
  role: 'detective' | 'actor' | 'saboteur';
  instruction?: string;
  hasBeenDetective?: boolean; // 🆕 NEU: Track ob Spieler schon Detektiv war
  detectiveCount?: number;    // 🆕 NEU: Wie oft war Spieler schon Detektiv
  drinks?: number; // Optional für Adults Version
}

export type GameMode = 'single' | 'bo3' | 'bo5' | 'bo7' | 'bo10' | 'chaos';

export interface PlayerScore {
  playerId: string;
  playerName: string;
  score: number;
  drinks?: number; // Optional für Adults Version
}

export interface ChaosRule {
  id: string;
  name: string;
  description: string;
  duration: 'round' | 'game' | 'instant';
  trigger: 'start' | 'wrong_guess' | 'correct_guess' | 'random' | 'tip_used';
  drinkingAction: {
    type: 'sip' | 'shot' | 'social' | 'custom';
    amount: number;
    target: 'player' | 'all' | 'team' | 'random' | 'detective';
  };
}

export interface GameConfig {
  players: Player[];
  detective: Player;
  instruction: string;
  gameMode: GameMode;
  currentRound: number;
  totalRounds: number;
  playerScores: PlayerScore[];
  saboteurCount: number;
  usedDetectives?: string[]; // 🆕 NEU: IDs der Spieler die schon Detektiv waren
  // Optionale Properties für Adults Version
  activeChaosRules?: ChaosRule[];
  totalDrinks?: number;
}

export type GameState = 'idle' | 'running' | 'paused' | 'finished';

export interface Tip {
  level: number;
  text: string;
}

export type GameVersion = 'classic' | 'kids' | 'party';

export const COLORS = {
  classic: {
    primary: '#26495c',
    secondary: '#c4a35a', 
    accent: '#c66b3d',
    background: '#e5e5dc',
    text: '#000000'
  },
  kids: {
    primary: '#4a90e2',
    secondary: '#ffd166',
    accent: '#06d6a0',
    background: '#ffffff',
    text: '#000000'
  },
  adults: {
    primary: '#8b0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    background: '#1a1a1a',
    text: '#FFFFFF',
    danger: '#ff4444',
    success: '#44ff44',
    warning: '#ffaa00'
  }
};

export type RootStackParamList = {
  // Hauptnavigation
  MainMenu: undefined;
  ClassicHome: undefined;
  KidsHome: undefined;
  PartyHome: undefined;
  
  // Classic Version Flow
  PlayerNameSetup: undefined;
  GameModeSetup: { playerNames: string[] };
  SaboteurModeSetup: { playerNames: string[]; gameMode: GameMode };
  PlayerSetup: { existingGameConfig?: GameConfig };
  RoleReveal: { gameConfig: GameConfig };
  Game: { gameConfig: GameConfig };
  Rules: undefined;
  Leaderboard: { gameConfig: GameConfig; detectiveWon: boolean };
  SaboteurVoting: { gameConfig: GameConfig; onVoteComplete: () => void };

  // Kids Version Flow
  KidsPlayerNameSetup: undefined;
  KidsGameModeSetup: { playerNames: string[] };
  KidsRoleReveal: { gameConfig: GameConfig };
  KidsGame: { gameConfig: GameConfig };
  KidsRules: undefined;
  KidsLeaderboard: { gameConfig: GameConfig };

  // Adults/Party Version Flow
  PartyPlayerNameSetup: undefined;
  PartyGameModeSetup: { playerNames: string[] };
  PartyChaosRuleSelection: { playerNames: string[]; gameMode: GameMode };
  PartyRoleReveal: { gameConfig: GameConfig };
  PartyGame: { gameConfig: GameConfig };
  PartyLeaderboard: { gameConfig: GameConfig; detectiveWon: boolean };
  PartyRules: undefined;
};

export interface ChaosRuleSelection {
  rule: ChaosRule;
  selected: boolean;
}

export interface ChaosRuleCategory {
  name: string;
  rules: ChaosRule[];
  icon: string;
}

export interface PartyChaosRuleSelectionScreenProps {
  navigation: any;
  route: any;
}

export interface AdultsGameConfig extends GameConfig {
  activeChaosRules: ChaosRule[];
  totalDrinks: number;
  selectedRuleIds?: string[];
}

export interface ChaosRuleActivationResult {
  rule: ChaosRule;
  activatedAt: number;
  affectedPlayers: string[];
  drinkingActionExecuted: boolean;
}

export interface DrinkingActionResult {
  playerName: string;
  action: string;
  amount: number;
  type: 'sip' | 'shot';
  success: boolean;
}

export interface AdultsPlayer extends Player {
  drinks: number;
  chaosRuleViolations: number;
}

export interface AdultsPlayerScore extends PlayerScore {
  drinks: number;
  chaosPoints: number;
}

export interface GetRandomChaosRulesParams {
  count?: number;
  categories?: string[];
  excludeIds?: string[];
}

export interface ChaosRuleFilterOptions {
  byTrigger?: ChaosRule['trigger'];
  byDuration?: ChaosRule['duration'];
  byTarget?: ChaosRule['drinkingAction']['target'];
  maxDrinks?: number;
}