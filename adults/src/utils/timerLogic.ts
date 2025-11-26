export const TIP_PENALTIES = [120, 120, 120]; // 2 Minuten pro Tipp in Sekunden
export const TIP_COOLDOWNS = [120, 120, 120]; // 2 Minuten Cooldown zwischen Tipps
export const INITIAL_TIME = 900; // 15 Minuten in Sekunden

export const calculateTimeAfterTip = (currentTime: number, tipsUsed: number): number => {
  if (tipsUsed >= TIP_PENALTIES.length) return currentTime;
  const penalty = TIP_PENALTIES[tipsUsed];
  return Math.max(0, currentTime - penalty);
};

export const getTipCooldown = (tipLevel: number): number => {
  if (tipLevel >= TIP_COOLDOWNS.length) return TIP_COOLDOWNS[TIP_COOLDOWNS.length - 1];
  return TIP_COOLDOWNS[tipLevel];
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Party-spezifische Timer-Funktionen
export const CHAOS_EVENT_INTERVAL = 180; // 3 Minuten zwischen Chaos-Events
export const RUSSIAN_ROULETTE_COOLDOWN = 300; // 5 Minuten Cooldown für Roulette

export const shouldTriggerChaosEvent = (elapsedTime: number): boolean => {
  return elapsedTime % CHAOS_EVENT_INTERVAL === 0 && elapsedTime > 0;
};

export const canTriggerRoulette = (lastRouletteTime: number, currentTime: number): boolean => {
  return currentTime - lastRouletteTime >= RUSSIAN_ROULETTE_COOLDOWN;
};