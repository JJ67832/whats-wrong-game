// adults/src/types/index.ts - VOLLSTÄNDIG KORRIGIERT MIT ALLEN EXPORTS
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { 
  Player as BasePlayer, 
  GameMode as BaseGameMode, 
  PlayerScore as BasePlayerScore, 
  GameConfig as BaseGameConfig,
  ChaosRule as BaseChaosRule,
  COLORS 
} from '../../../src/types';

// 🟢 KORRIGIERT: Explizite Rollen-Definition für Adults MIT EXPORT
export type AdultsRole = 'detective' | 'actor' | 'saboteur';

// 🟢 KORRIGIERT: AdultsPlayer mit expliziten Typen
export interface AdultsPlayer {
  id: string;
  name: string;
  role: AdultsRole;
  instruction?: string;
  drinks: number;
  chaosRuleViolations: number;
  hasBeenDetective?: boolean;
  detectiveCount?: number;
  lastRole?: AdultsRole;
}

export type GameMode = BaseGameMode;

export interface PlayerScore extends BasePlayerScore {
  drinks: number;
}

export interface ChaosRule extends BaseChaosRule {}

// 🟢 KORRIGIERT: AdultsGameConfig mit expliziten Typen
export interface AdultsGameConfig extends Omit<BaseGameConfig, 'players' | 'playerScores' | 'gameMode'> {
  players: AdultsPlayer[];
  playerScores: PlayerScore[];
  gameMode: GameMode;
  activeChaosRules: ChaosRule[];
  totalDrinks: number;
  usedDetectives?: string[];
  roleRotationEnabled?: boolean;
  nextDetectiveIndex?: number;
}

export type GameState = 'idle' | 'running' | 'paused' | 'finished';

export interface Tip {
  level: number;
  text: string;
  cooldown?: number;
}

// Adults-spezifische Colors
export const ADULTS_COLORS = {
  primary: '#8b0000',
  secondary: '#000000',
  accent: '#FFFFFF',
  background: '#1a1a1a',
  text: '#FFFFFF',
  danger: '#ff4444',
  success: '#44ff44',
  warning: '#ffaa00',
};

// Navigation Types für Adults Version
export type AdultsStackParamList = {
  PartyHome: undefined;
  PartyPlayerNameSetup: undefined;
  PartyGameModeSetup: { playerNames: string[] };
  PartyChaosRuleSelection: { playerNames: string[]; gameMode: GameMode };
  PartyRoleReveal: { gameConfig: AdultsGameConfig };
  PartyGame: { gameConfig: AdultsGameConfig };
  PartyLeaderboard: { gameConfig: AdultsGameConfig; detectiveWon: boolean };
  PartyRules: undefined;
  MainMenu: undefined;
};

// 🟢 KORRIGIERT: navigateToMainMenu Funktion
export const navigateToMainMenu = (navigation: any) => {
  navigation.navigate('MainMenu' as never);
};

// Zusätzliche Erwachsenen-spezifische Typen
export interface DrinkingAction {
  type: 'sip' | 'shot' | 'social' | 'custom';
  amount: number;
  target: 'player' | 'all' | 'team' | 'random' | 'detective';
  message: string;
}

export interface RouletteResult {
  chamber: number;
  drinks: number;
  type: 'sip' | 'shot' | 'social';
  target: 'player' | 'all' | 'detective' | 'random';
  penalty: string;
  text: string;
}

export interface PartyQuestion {
  id: string;
  question: string;
  category: 'personal' | 'challenge' | 'fun' | 'dare';
  intensity: 'mild' | 'medium' | 'hot';
}

// Hilfstypen für Komponenten-Props
export interface ChaosRuleCardProps {
  rule: ChaosRule;
  isActive: boolean;
  onToggle?: (rule: ChaosRule) => void;
}

export interface DrinkingCounterProps {
  playerName: string;
  drinks: number;
  isDetective: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export interface RouletteWheelProps {
  onSpinComplete: (result: RouletteResult) => void;
  chamberCount?: number;
  size?: number;
}

// 🟢 KORRIGIERT: Rollen-Rotation Typen MIT EXPORTS
export interface RoleStatistics {
  totalRounds: number;
  currentRound: number;
  detectiveRotation: DetectiveRotation[];
  drinkingStats: DrinkingStats;
  chaosRuleActivations: number;
}

export interface DetectiveRotation {
  round: number;
  detectiveName: string;
  detectiveId: string;
  drinksConsumed: number;
  chaosViolations: number;
}

export interface RotationConfig {
  enableFairRotation: boolean;
  maxConsecutiveDetective: number;
  considerDrinkingLevel: boolean;
  chaosRuleInfluence: boolean;
  randomFactor: number;
}

export interface RoleRotationUtils {
  initializeRoles: (playerNames: string[], gameMode: GameMode, activeChaosRules: ChaosRule[]) => AdultsGameConfig;
  rotateRolesForNextRound: (currentConfig: AdultsGameConfig) => AdultsGameConfig;
  resetRolesForNewGame: (playerNames: string[], gameMode: GameMode, activeChaosRules: ChaosRule[]) => AdultsGameConfig;
  getRoleStatistics: (gameConfig: AdultsGameConfig) => RoleStatistics;
  getDrinkingStatistics: (gameConfig: AdultsGameConfig) => DrinkingStats;
  calculateNextDetective: (players: AdultsPlayer[], usedDetectives: string[]) => number;
}

// State-Typen für die Adults Version
export interface PartyGameState {
  gameState: GameState;
  timeLeft: number;
  tipsUsed: number;
  currentTip: Tip | null;
  tipCooldown: number;
  isTipAvailable: boolean;
  activeChaosRules: ChaosRule[];
  drinkingHistory: string[];
  showTruthOrDrink: boolean;
  showRoulette: boolean;
  currentQuestion: string;
  rouletteResult: RouletteResult | null;
  showRouletteResult: boolean;
}

// Konfigurationstypen für Spielmodi
export interface PartyGameMode {
  id: string;
  gameMode: GameMode;
  icon: string;
  title: string;
  description: string;
  color: string;
  chaosRules: number;
  duration: number;
}

// Response-Typen für Utility-Funktionen
export interface DrinkingGameResult {
  action: DrinkingAction;
  updatedPlayers: AdultsPlayer[];
  updatedScores: PlayerScore[];
  message: string;
}

export interface ChaosRuleActivation {
  rule: ChaosRule;
  trigger: ChaosRule['trigger'];
  timestamp: number;
  affectedPlayers: string[];
}

export interface RouletteConfig {
  chamberCount: number;
  spinDuration: number;
  results: RouletteResult[];
  autoTrigger: boolean;
  triggerAfterTip: boolean;
}

// Event-Typen für Game-Events
export type GameEvent = 
  | { type: 'CHAOS_RULE_ACTIVATED'; payload: ChaosRuleActivation }
  | { type: 'DRINKING_ACTION'; payload: DrinkingGameResult }
  | { type: 'ROULETTE_SPIN'; payload: RouletteResult }
  | { type: 'TRUTH_OR_DRINK_CHOICE'; payload: { choice: 'truth' | 'drink'; question: string } }
  | { type: 'TIP_USED'; payload: { tipLevel: number; timePenalty: number } }
  | { type: 'ROULETTE_TRIGGERED'; payload: { source: 'tip' | 'timer' | 'manual' } };

// Props-Typen für alle Adults Screens
export interface PartyScreenProps {
  navigation: any;
  route: any;
}

// Spezifische Screen Props
export interface PartyHomeScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyHome'>;
}

export interface PartyPlayerNameSetupScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyPlayerNameSetup'>;
}

export interface PartyGameModeSetupScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyGameModeSetup'>;
  route: RouteProp<AdultsStackParamList, 'PartyGameModeSetup'>;
}

export interface PartyChaosRuleSelectionScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyChaosRuleSelection'>;
  route: RouteProp<AdultsStackParamList, 'PartyChaosRuleSelection'>;
}

export interface PartyRoleRevealScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyRoleReveal'>;
  route: RouteProp<AdultsStackParamList, 'PartyRoleReveal'>;
}

export interface PartyGameScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyGame'>;
  route: RouteProp<AdultsStackParamList, 'PartyGame'>;
}

export interface PartyLeaderboardScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyLeaderboard'>;
  route: RouteProp<AdultsStackParamList, 'PartyLeaderboard'>;
}

export interface PartyRulesScreenProps {
  navigation: StackNavigationProp<AdultsStackParamList, 'PartyRules'>;
}

// Utility-Typen für die Komponenten
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  size?: ButtonSize;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export interface ModalState {
  visible: boolean;
  type: 'tip' | 'success' | 'giveUp' | 'truthOrDrink' | 'roulette' | 'rouletteResult' | 'chaosRule';
  data?: any;
}

// Timer-Typen
export interface TimerConfig {
  initialTime: number;
  timePenaltyPerTip: number[];
  cooldownPerTip: number[];
  warningThreshold: number;
  criticalThreshold: number;
}

// Sound und Vibration-Typen
export interface SoundEffects {
  playChaosRule: () => void;
  playDrinking: () => void;
  playSuccess: () => void;
  playFailure: () => void;
  playRoulette: () => void;
  playRouletteResult: () => void;
}

// Roulette Segment für das Rad
export interface RouletteSegment {
  chamber: number;
  color: string;
  textColor: string;
  label: string;
  result: RouletteResult;
}

// Roulette History Eintrag
export interface RouletteHistoryEntry {
  id: string;
  timestamp: number;
  result: RouletteResult;
  playerName?: string;
}

// Trink-Statistik
export interface DrinkingStats {
  totalDrinks: number;
  shots: number;
  sips: number;
  socialDrinks: number;
  mostDrinksPlayer: string;
  mostDrinksCount: number;
}

// Export aller Typen für einfachen Zugriff
export type {
  BasePlayer,
  BaseGameMode, 
  BasePlayerScore,
  BaseGameConfig,
  BaseChaosRule
};

// Default Roulette Results für bessere Konsistenz
export const DEFAULT_ROULETTE_RESULTS: RouletteResult[] = [
  { chamber: 1, drinks: 0, type: 'sip', target: 'player', penalty: 'Glück gehabt!', text: '🎉 Glück gehabt! Keine Strafe!' },
  { chamber: 2, drinks: 1, type: 'sip', target: 'player', penalty: 'Leichte Strafe', text: '💀 Kammer 2: 1 Schluck für dich!' },
  { chamber: 3, drinks: 2, type: 'sip', target: 'player', penalty: 'Mittlere Strafe', text: '💀💀 Kammer 3: 2 Schlucke für dich!' },
  { chamber: 4, drinks: 1, type: 'shot', target: 'player', penalty: 'Schwere Strafe', text: '🥃 Kammer 4: 1 Shot für dich!' },
  { chamber: 5, drinks: 1, type: 'sip', target: 'all', penalty: 'Soziales Trinken', text: '👥 Kammer 5: 1 Schluck für ALLE!' },
  { chamber: 6, drinks: 2, type: 'shot', target: 'detective', penalty: 'Detektiv-Strafe', text: '🔍 Kammer 6: 2 Shots für den Detektiv!' },
  { chamber: 7, drinks: 3, type: 'sip', target: 'player', penalty: 'Volltreffer', text: '💀💀💀 KAMMER 7: 3 SCHLUCKE für dich!' },
  { chamber: 8, drinks: 0, type: 'sip', target: 'player', penalty: 'Immunität', text: '🛡️ Kammer 8: Immunität! Keine Strafe!' }
];

// Default Rotation Konfiguration
export const DEFAULT_ROTATION_CONFIG: RotationConfig = {
  enableFairRotation: true,
  maxConsecutiveDetective: 2,
  considerDrinkingLevel: true,
  chaosRuleInfluence: true,
  randomFactor: 0.3
};