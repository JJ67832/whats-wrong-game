export const INSTRUCTIONS = [
  "Beantworte die Fragen so, wie du glaubst, dass es die Person rechts neben dir tun würde",
  "Füge in jede Antwort ein Tier ein",
  "Wiederhole die Frage in deiner Antwort",
  "Sage immer das Gegenteil zur Wahrheit",
  "Kopiere den letzten Teil der Antwort des vorherigen Spielers",
  "Beginne jede Antwort mit Also",
  "Verwende in jeder Antwort mindestens ein englisches Wort",
  "Jede Antwort muss 7 Wörter lang sein",
  "Wiederhole immer das Wort 'eigentlich'",
  "Sage bei jeder Antwort die letzten drei Wörter zweimal",
  "Antwort muss mit demselben Buchstaben beginnen wie die Frage",
  "Antworte mit 3 Sekunden Verzögerung",
  "Gebe immer extrem ausführliche Antworten",
  "Ende jede Antwort mit 'glaube ich'",
  "Antworte nur wenn dein Name zuerst genannt wurde",
];

export const getRandomInstruction = (): string => {
  const randomIndex = Math.floor(Math.random() * INSTRUCTIONS.length);
  return INSTRUCTIONS[randomIndex];
};