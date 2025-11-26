// Kindgerechte Anweisungen - lustig und einfach
export const KIDS_INSTRUCTIONS = [
  "Mache bei jeder Antwort ein Tiergeräusch 🐮",
  "Hüpfe einmal bevor du antwortest 🦘", 
  "Singe deine Antwort wie in einem Lied 🎵",
  "Antworte nur mit Reimwörtern 📝",
  "Mache eine lustige Grimasse dabei 😜",
  "Stelle dich auf ein Bein während du redest 🦩",
  "Flüstere deine Antwort leise wie ein Mäuschen 🐭",
  "Sage jedes Wort zweimal zweimal 👯",
  "Klatsche in die Hände vor jeder Antwort 👏",
  "Tu so, als wärst du ein Roboter 🤖",
  "Antworte in einer anderen Sprache (Quatsch-Sprache!) 🗣️",
  "Lache laut bevor du beginnst 😂",
  "Zeige mit den Fingern, wie alt du bist 🖐️",
  "Drehe dich einmal im Kreis 🔄",
  "Mache ein Selfie-Gesicht beim Antworten 🤳"
];

export const getRandomInstruction = (): string => {
  const randomIndex = Math.floor(Math.random() * KIDS_INSTRUCTIONS.length);
  return KIDS_INSTRUCTIONS[randomIndex];
};