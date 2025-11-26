// adults/src/utils/chaosRules.ts - MIT FLÜSTERMODUS
import { ChaosRule } from '../types';

export const CHAOS_RULES: ChaosRule[] = [
  // 🆕 NEUE FLÜSTERMODUS REGEL
  {
    id: 'whisper_mode',
    name: '🤫 FLÜSTERMODUS',
    description: 'Alle müssen flüsternd sprechen! Lautes Reden wird bestraft!',
    duration: 'game',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 2,
      target: 'player'
    }
  },
  // 🚫 VERBOTENE WÖRTER
  {
    id: 'forbidden_words',
    name: '🚫 Verbotene Wörter',
    description: 'Die Wörter "trinken", "Spiel" und "falsch" sind verboten!',
    duration: 'game',
    trigger: 'random',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'clap_before_drink',
    name: '👏 Klatschen vor Trinken',
    description: 'Vor jedem Trinken muss einmal in die Hände geklatscht werden!',
    duration: 'game',
    trigger: 'random',
    drinkingAction: {
      type: 'sip',
      amount: 2,
      target: 'player'
    }
  },
  {
    id: 'stand_up',
    name: '🪑 Immer aufstehen',
    description: 'Bei jeder Antwort muss man aufstehen!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'no_names',
    name: '❌ Namen verboten',
    description: 'Niemand darf Namen sagen!',
    duration: 'game',
    trigger: 'random',
    drinkingAction: {
      type: 'shot',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'touch_nose',
    name: '👆 Nase berühren',
    description: 'Vor dem Sprechen muss man sich an die Nase fassen!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'slow_motion',
    name: '🐌 Zeitlupe',
    description: 'Alle Bewegungen müssen in Zeitlupe sein!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'english_only',
    name: '🔤 Englisch-Pflicht',
    description: 'Es darf nur Englisch gesprochen werden!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 2,
      target: 'player'
    }
  },
  {
    id: 'no_pointing',
    name: '☝️ Zeigen verboten',
    description: 'Mit Fingern auf etwas zeigen ist nicht erlaubt!',
    duration: 'game',
    trigger: 'random',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'air_guitar',
    name: '🎸 Air-Guitar',
    description: 'Vor dem Trinken muss Air-Guitar gespielt werden!',
    duration: 'game',
    trigger: 'random',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'compliment',
    name: '💬 Komplimente',
    description: 'Vor jeder Antwort ein Kompliment machen!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'no_hands',
    name: '🙅‍♂️ Hände verboten',
    description: 'Hände dürfen nicht benutzt werden!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 2,
      target: 'player'
    }
  },
  {
    id: 'dance_move',
    name: '💃 Tanz-Bewegung',
    description: 'Bei jedem Fehler eine Tanz-Bewegung machen!',
    duration: 'game',
    trigger: 'wrong_guess',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'animal_sounds',
    name: '🐮 Tiergeräusche',
    description: 'Antworten müssen mit Tiergeräuschen enden!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  },
  {
    id: 'left_hand',
    name: '✋ Linkshänder',
    description: 'Alles muss mit der linken Hand gemacht werden!',
    duration: 'round',
    trigger: 'start',
    drinkingAction: {
      type: 'sip',
      amount: 1,
      target: 'player'
    }
  }
];

export const getRandomChaosRules = (count: number = 3): ChaosRule[] => {
  const shuffled = [...CHAOS_RULES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getChaosRulesByCategory = () => {
  return {
    'kommunikation': CHAOS_RULES.filter(rule => 
      rule.name.includes('Flüster') || 
      rule.description.includes('sprechen') || 
      rule.description.includes('sagen') || 
      rule.description.includes('flüstern') ||
      rule.name.includes('Englisch') ||
      rule.name.includes('Komplimente')
    ),
    'verbote': CHAOS_RULES.filter(rule => 
      rule.name.includes('verboten') || 
      rule.description.includes('verboten') ||
      rule.name.includes('Namen') ||
      rule.name.includes('Zeigen')
    ),
    'aktionen': CHAOS_RULES.filter(rule => 
      rule.description.includes('machen') || 
      rule.description.includes('berühren') || 
      rule.description.includes('klatschen') ||
      rule.name.includes('Klatschen') ||
      rule.name.includes('Tanz') ||
      rule.name.includes('Air-Guitar')
    ),
    'bewegung': CHAOS_RULES.filter(rule => 
      rule.description.includes('bewegen') || 
      rule.description.includes('stehen') || 
      rule.description.includes('Hand') ||
      rule.name.includes('aufstehen') ||
      rule.name.includes('Linkshänder') ||
      rule.name.includes('Zeitlupe')
    )
  };
};