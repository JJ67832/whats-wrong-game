import { KIDS_INSTRUCTIONS } from './instructions';

export interface Tip {
  level: number;
  text: string;
  cooldown: number;
}

export const KIDS_TIPS_DATABASE: { [key: string]: Tip[] } = {
  // Tiergeräusch Tipps
  "Mache bei jeder Antwort ein Tiergeräusch 🐮": [
    {
      level: 1,
      text: "Achte auf lustige Geräusche zwischen den Antworten",
      cooldown: 120
    },
    {
      level: 2, 
      text: "Manche Geräusche kommen von Tieren",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler machen Geräusche wie Tiere",
      cooldown: 120
    }
  ],

  // Hüpfen Tipps
  "Hüpfe einmal bevor du antwortest 🦘": [
    {
      level: 1,
      text: "Achte auf Bewegung vor den Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler machen eine kleine Bewegung bevor sie reden",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um Hüpfen!",
      cooldown: 120
    }
  ],

  // Singen Tipps
  "Singe deine Antwort wie in einem Lied 🎵": [
    {
      level: 1,
      text: "Die Antworten klingen etwas musikalisch",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf den Rhythmus der Antworten",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler singen ihre Antworten",
      cooldown: 120
    }
  ],

  // Reime Tipps
  "Antworte nur mit Reimwörtern 📝": [
    {
      level: 1,
      text: "Die Antworten reimen sich manchmal",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf Wörter die sich ähnlich anhören",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um Reime!",
      cooldown: 120
    }
  ],

  // Grimassen Tipps
  "Mache eine lustige Grimasse dabei 😜": [
    {
      level: 1,
      text: "Achte auf die Gesichter der Spieler",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler verziehen ihre Gesichter",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um lustige Gesichter!",
      cooldown: 120
    }
  ],

  // Ein Bein Tipps
  "Stelle dich auf ein Bein während du redest 🦩": [
    {
      level: 1,
      text: "Achte auf die Körperhaltung der Spieler",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler stehen anders als normal",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um das Stehen auf einem Bein!",
      cooldown: 120
    }
  ],

  // Flüstern Tipps
  "Flüstere deine Antwort leise wie ein Mäuschen 🐭": [
    {
      level: 1,
      text: "Achte auf die Lautstärke der Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Manche Antworten sind sehr leise",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler flüstern ihre Antworten",
      cooldown: 120
    }
  ],

  // Wörter zweimal Tipps
  "Sage jedes Wort zweimal zweimal 👯": [
    {
      level: 1,
      text: "Die Antworten haben viele Wiederholungen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf Wörter die doppelt vorkommen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Jedes Wort wird zweimal gesagt!",
      cooldown: 120
    }
  ],

  // Klatschen Tipps
  "Klatsche in die Hände vor jeder Antwort 👏": [
    {
      level: 1,
      text: "Achte auf Geräusche vor den Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler machen eine Bewegung mit den Händen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um Klatschen!",
      cooldown: 120
    }
  ],

  // Roboter Tipps
  "Tu so, als wärst du ein Roboter 🤖": [
    {
      level: 1,
      text: "Die Antworten klingen etwas mechanisch",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf roboterhafte Bewegungen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler benehmen sich wie Roboter",
      cooldown: 120
    }
  ],

  // Quatsch-Sprache Tipps
  "Antworte in einer anderen Sprache (Quatsch-Sprache!) 🗣️": [
    {
      level: 1,
      text: "Die Antworten sind manchmal schwer zu verstehen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf unbekannte Wörter oder Laute",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler reden in einer Quatsch-Sprache!",
      cooldown: 120
    }
  ],

  // Lachen Tipps
  "Lache laut bevor du beginnst 😂": [
    {
      level: 1,
      text: "Achte auf Lachen vor den Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler lachen bevor sie antworten",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um Lachen!",
      cooldown: 120
    }
  ],

  // Finger-Alter Tipps
  "Zeige mit den Fingern, wie alt du bist 🖐️": [
    {
      level: 1,
      text: "Achte auf Handzeichen bei den Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler zeigen etwas mit den Fingern",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um das Alter mit Fingern zeigen!",
      cooldown: 120
    }
  ],

  // Drehen Tipps
  "Drehe dich einmal im Kreis 🔄": [
    {
      level: 1,
      text: "Achte auf Drehbewegungen vor den Antworten",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler drehen sich bevor sie antworten",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht ums Drehen im Kreis!",
      cooldown: 120
    }
  ],

  // Selfie-Gesicht Tipps
  "Mache ein Selfie-Gesicht beim Antworten 🤳": [
    {
      level: 1,
      text: "Achte auf besondere Gesichtsausdrücke",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler machen ein bestimmtes Gesicht",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um Selfie-Gesichter!",
      cooldown: 120
    }
  ]
};

export const getTipForInstruction = (instruction: string, level: number): Tip | null => {
  const tips = KIDS_TIPS_DATABASE[instruction];
  if (!tips) return null;
  
  return tips.find(tip => tip.level === level) || null;
};

export const getFallbackTip = (level: number): Tip => {
  const fallbackTips: Tip[] = [
    {
      level: 1,
      text: "Achte auf besondere Bewegungen oder Geräusche",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler machen etwas Lustiges oder Ungewöhnliches",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es geht um eine bestimmte, lustige Aufgabe",
      cooldown: 120
    }
  ];
  
  return fallbackTips[level - 1] || fallbackTips[0];
};