import { INSTRUCTIONS } from './instructions';

export interface Tip {
  level: number;
  text: string;
  cooldown: number;
}

export const TIPS_DATABASE: { [key: string]: Tip[] } = {
  // Tier-Tipps
  "Füge in jede Antwort ein Tier ein": [
    {
      level: 1,
      text: "Achte auf ungewöhnliche Nomen in den Antworten",
      cooldown: 120
    },
    {
      level: 2, 
      text: "Manche Wörter scheinen nicht natürlich in den Kontext zu passen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Antworten enthalten bestimmte Kategorien von Wörtern, die wiederholt auftauchen",
      cooldown: 120
    }
  ],

  // Frage wiederholen Tipps
  "Wiederhole die Frage in deiner Antwort": [
    {
      level: 1,
      text: "Die Antworten sind ziemlich lang.",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Struktur der Antworten folgt einem bestimmten Muster",
      cooldown: 120
    },
    {
      level: 3,
      text: "Deine Wörter scheinen von anderen benutzt zu werden",
      cooldown: 120
    }
  ],

  // Gegenteil Tipps
  "Sage immer das Gegenteil zur Wahrheit": [
    {
      level: 1,
      text: "Manche Antworten wirken absichtlich irreführend",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Spieler scheinen eine bestimmte Denkrichtung zu vermeiden",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine systematische Abweichung von erwarteten Antworten",
      cooldown: 120
    }
  ],

  // Letzten Teil kopieren Tipps
  "Kopiere den letzten Teil der Antwort des vorherigen Spielers": [
    {
      level: 1,
      text: "Achte auf Echo-Effekte in der Gesprächsrunde",
      cooldown: 120
    },
    {
      level: 2,
      text: "Bestimmte Phrasen tauchen in aufeinanderfolgenden Antworten auf",
      cooldown: 120
    },
    {
      level: 3,
      text: "Antworten scheinen ineinander über zu gehen",
      cooldown: 120
    }
  ],

  // Also Tipps
  "Beginne jede Antwort mit Also": [
    {
      level: 1,
      text: "Die Antworten teilen vier Buchstaben.",
      cooldown: 120
    },
    {
      level: 2,
      text: "Es gibt ein gemeinsames sprachliches Element am Anfang der Sätze",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Einleitung es ist die Einleitung.",
      cooldown: 120
    }
  ],

  // Englische Wörter Tipps
  "Verwende in jeder Antwort mindestens ein englisches Wort": [
    {
      level: 1,
      text: "Achte auf ungewöhnliche Sprachmischungen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Manche Wörter stechen durch ihre Herkunft hervor",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine fremdsprachliche Komponente in den Antworten",
      cooldown: 120
    }
  ],

  // 7 Wörter Tipps
  "Jede Antwort muss 7 Wörter lang sein": [
    {
      level: 1,
      text: "Die Antworten haben eine bemerkenswerte Gleichmäßigkeit in der Länge",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf die Ausführlichkeit der Antworten - sie scheint reguliert zu sein",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Spieler müssen ihre Antworten auf eine bestimmte Weise strukturieren",
      cooldown: 120
    }
  ],

  // Eigentlich Tipps
  "Wiederhole immer das Wort 'eigentlich'": [
    {
      level: 1,
      text: "Ein bestimmtes Wort taucht häufiger auf als normal",
      cooldown: 120
    },
    {
      level: 2,
      text: "Es gibt ein wiederkehrendes Füllwort in den Antworten",
      cooldown: 120
    },
    {
      level: 3,
      text: "Das Füllwort muss nicht am Anfang des Satzes sein.",
      cooldown: 120
    }
  ],

  // Letzten drei Wörter wiederholen Tipps
  "Sage bei jeder Antwort die letzten drei Wörter zweimal": [
    {
      level: 1,
      text: "Manche Antworten haben eine ungewöhnliche rhythmische Struktur",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf Wiederholungen am Ende der Sätze",
      cooldown: 120
    },
    {
      level: 3,
      text: "Die Antworten haben eine besondere Betonung auf ihren Schlussteilen",
      cooldown: 120
    }
  ],

  // Gleicher Buchstabe Tipps
  "Antwort muss mit demselben Buchstaben beginnen wie die Frage": [
    {
      level: 1,
      text: "Es gibt eine Verbindung zwischen Frage und Antwort",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Anfänge der Antworten folgen einem Muster basierend auf den Fragen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Achte auf Ähnlichkeiten der Buchstaben zwischen Frage und Antwort",
      cooldown: 120
    }
  ],

  // Verzögerung Tipps
  "Antworte mit 3 Sekunden Verzögerung": [
    {
      level: 1,
      text: "Die Antwortgeschwindigkeit wirkt unnatürlich reguliert",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf die Pausen zwischen Frage und Antwort",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine zeitliche Komponente im Antwortverhalten",
      cooldown: 120
    }
  ],



  // Glaube ich Tipps
  "Ende jede Antwort mit 'glaube ich'": [
    {
      level: 1,
      text: "Die Antworten enden auf eine bestimmte Weise",
      cooldown: 120
    },
    {
      level: 2,
      text: "Achte auf wiederkehrende Schlusswendungen",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine konsistente phrase am Ende jeder Antwort",
      cooldown: 120
    }
  ],

  // Name zuerst genannt Tipps
  "Antworte nur wenn dein Name zuerst genannt wurde": [
    {
      level: 1,
      text: "Nicht jeder antwortet auf jede Frage",
      cooldown: 120
    },
    {
      level: 2,
      text: "Die Antwortbereitschaft hängt von der Fragestellung ab",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine Bedingung dafür, wer wann antwortet",
      cooldown: 120
    }
  ],

  // Person rechts Tipps
  "Beantworte die Fragen so, wie du glaubst, dass es die Person rechts neben dir tun würde": [
    {
      level: 1,
      text: "Die Antworten scheinen nicht immer zur Person zu passen",
      cooldown: 120
    },
    {
      level: 2,
      text: "Manche Spieler antworten unerwartet",
      cooldown: 120
    },
    {
      level: 3,
      text: "Es gibt eine Verschiebung in der Perspektive der Antworten",
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
      text: "Die Spieler folgen einer spezifischen, aber versteckten Regel",
      cooldown: 120
    }
  ];
  
  return fallbackTips[level - 1] || fallbackTips[0];
};