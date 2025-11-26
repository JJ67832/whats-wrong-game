import { ADULT_INSTRUCTIONS } from './instructions';

export interface Tip {
  level: number;
  text: string;
  cooldown: number;
}

export const TIPS_DATABASE: { [key: string]: Tip[] } = {
  // Freche Bemerkungen Tipps
  "Antworte immer mit einer frechen oder anzüglichen Bemerkung": [
    {
      level: 1,
      text: "Achte auf ungewöhnlich provokante Antworten",
      cooldown: 120
    },
    {
      level: 2, 
      text: "Manche Antworten scheinen absichtlich grenzwertig",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Antworten haben eine durchgehend freche oder anzügliche Note",
      cooldown: 120
    }
  ],

  // Glas berühren Tipps
  "Berühre dein Glas bei jeder Antwort": [
    {
      level: 1,
      text: "Beobachte die Bewegungen der Hände genau",
      cooldown: 120
    },
    {
      level: 2,
      text: "Es gibt ein wiederkehrendes physisches Muster",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler führen bei jeder Antwort die gleiche Geste aus",
      cooldown: 120
    }
  ],

  // Lachen Trinken Tipps
  "Trinke einen Schluck, wenn jemand lacht": [
    {
      level: 1,
      text: "Achte auf ungewöhnliche Trink-Muster",
      cooldown: 120
    },
    {
      level: 2,
      text: "Bestimmte Geräusche lösen Trink-Aktionen aus",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt einen spezifischen Auslöser für die Trink-Aktionen",
      cooldown: 120
    }
  ],

  // Flirten Tipps
  "Flirte mit der Person rechts von dir": [
    {
      level: 1,
      text: "Achte auf ungewöhnliche soziale Interaktionen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Blickrichtung und Körpersprache folgt einem Muster",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Interaktionen sind auf bestimmte Personen ausgerichtet",
      cooldown: 120
    }
  ],

  // Uni-Geschichten Tipps
  "Beginne jede Antwort mit 'Also damals in der Uni...'": [
    {
      level: 1,
      text: "Die Antworten beginnen mit denselben Wörtern",
      cooldown: 120
    },
    {
      level: 2,
      text: "Es gibt eine konsistente Einleitung für jede Antwort",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Einleitung erzählt von vergangenen Erlebnissen",
      cooldown: 120
    }
  ],

  // Peinliche Geschichten Tipps
  "Erfinde eine peinliche Geschichte über dich selbst": [
    {
      level: 1,
      text: "Die Antworten enthalten ungewöhnlich persönliche Details",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Geschichten scheinen erfunden oder übertrieben",
      cooldown: 120
    },
    {
      level: 3,
      text: "Jede Antwort enthält eine selbstbezogene, peinliche Anekdote",
      cooldown: 120
    }
  ],

  // Prominente imitieren Tipps
  "Imitiere einen Prominenten bei jeder Antwort": [
    {
      level: 1,
      text: "Achte auf ungewöhnliche Sprechweisen oder Stimmen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Manche Antworten wirken wie eine Performance",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler imitieren durchgehend bekannte Persönlichkeiten",
      cooldown: 120
    }
  ]
};

export const getTipForInstruction = (instruction: string, level: number): Tip | null => {
  const tips = TIPS_DATABASE[instruction];
  if (!tips) return null;
  
  return tips.find(tip => tip.level === level) || null;
};

export const getFallbackTip = (level: number): Tip => {
  const fallbackTips: Tip[] = [
    {
      level: 1,
      text: "Achte auf subtile Muster im Antwortverhalten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Es gibt eine konsistente Abweichung vom normalen Gesprächsfluss",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler folgen einer spezifischen, aber versteckten Party-Regel",
      cooldown: 120
    }
  ];
  
  return fallbackTips[level - 1] || fallbackTips[0];
};