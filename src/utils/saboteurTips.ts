// utils/saboteurTips.ts

export const getSaboteurTip = (): string => {
  const tips = [
    "Stelle Fragen, die dir helfen, die Anweisung zu erraten, ohne Verdacht zu erregen.",
    "Beobachte die anderen genau, um Hinweise auf die Anweisung zu bekommen.",
    "Versuche, dich natürlich zu verhalten, während du die Anweisung herausfindest.",
    "Achte auf die Reaktionen der anderen, wenn der Detektiv Fragen stellt.",
    "Nutze die Abstimmungen, um Misstrauen auf andere zu lenken."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};