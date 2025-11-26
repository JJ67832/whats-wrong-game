// kids/src/types/index.ts
// VOLLSTÄNDIG AKTUALISIERT: Mit Rollen-Rotation Tracking

export interface Player {
  id: string;
  name: string;
  role: 'detective' | 'actor';
  instruction?: string;
  hasBeenDetective?: boolean; // 🆕 NEU: Track ob Spieler schon Detektiv war
  detectiveCount?: number;    // 🆕 NEU: Wie oft war Spieler schon Detektiv
}

export type GameMode = 'single' | 'bo3' | 'bo5';

export interface PlayerScore {
  playerId: string;
  playerName: string;
  score: number;
}

export interface GameConfig {
  players: Player[];
  detective: Player;
  instruction: string;
  gameMode: GameMode;
  currentRound: number;
  totalRounds: number;
  playerScores: PlayerScore[];
  usedDetectives?: string[]; // 🆕 NEU: IDs der Spieler die schon Detektiv waren
}

export type GameState = 'idle' | 'running' | 'paused' | 'finished';

export interface Tip {
  level: number;
  text: string;
}


