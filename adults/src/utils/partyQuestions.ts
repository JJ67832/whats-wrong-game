export const PARTY_QUESTIONS = [
  "Was ist das Peinlichste, was dir je in der Öffentlichkeit passiert ist?",
  "Hast du jemals etwas gestohlen (auch wenn es nur Kleinigkeiten waren)?",
  "Was ist das Dümmste, was du jemals betrunken getan hast?",
  "Hast du jemals bei einer Prüfung oder einem Test geschummelt?",
  "Was ist das Verrückteste, was du für eine Mutprobe getan hast?",
  "Hast du jemals jemanden heimlich geküsst, ohne dass die Person es wusste?",
  "Was ist das Ekligste, was du jemals gegessen oder getrunken hast?",
  "Hast du jemals in die Hose gemacht? (Auch als Erwachsener)",
  "Was ist dein peinlichstes Erlebnis mit deinen Eltern oder Schwiegereltern?",
  "Hast du jemals einen Freund oder eine Freundin hintergangen (nicht sexuell)?",
  "Was ist das Peinlichste, was du jemals in einem Chat oder einer Nachricht verschickt hast?",
  "Hast du jemals jemandem wehgetan und es später bereut?",
  "Was ist das Verrückteste, was du getan hast, um jemandem zu imponieren?",
  "Hast du jemals jemanden angelogen, um aus einer Verabredung herauszukommen?",
  "Was ist das Peinlichste, was dir je beim Dating passiert ist?",
  "Hast du jemals etwas kaputt gemacht und es heimlich repariert oder versteckt?",
  "Was ist dein peinlichstes Kleidungsstück, das du jemals getragen hast?",
  "Hast du jemals einen Fake-Account erstellt, um jemanden zu stalken?",
  "Was ist das Dümmste, was du jemals gesagt hast, ohne nachzudenken?",
  "Hast du jemals jemandem einen Streich gespielt, der nach hinten losging?",
  "Was ist das Peinlichste, was dir je beim Sport passiert ist?",
  "Hast du jemals etwas Illegales getan (auch wenn es nur klein war)?",
  "Was ist dein peinlichstes Musik- oder Filmgeheimnis?",
  "Hast du jemals jemanden mit Absicht ignoriert, obwohl du ihn gesehen hast?",
  "Was ist das Peinlichste, was du jemals in der Öffentlichkeit getan hast, ohne es zu merken?",
  "Hast du jemals etwas Verbotenes getan, das du nie zugegeben hast?",
  "Was ist das Peinlichste, was du jemals in einem Restaurant erlebt hast?",
  "Hast du jemals jemandem etwas weggenommen, das dir nicht gehörte?",
  "Was ist das Peinlichste, was dir je bei der Arbeit oder in der Schule passiert ist?",
  "Hast du jemals jemanden imitiert oder nachgemacht, ohne dass die Person es wusste?",
  "Was ist das Verrückteste, was du je aus Langeweile getan hast?",
  "Hast du jemals einen Unfall verursacht und bist einfach weitergefahren?",
  "Was ist das Peinlichste, was dir je mit einem Haustier passiert ist?",
  "Hast du jemals Essen geklaut oder ohne zu bezahlen aus einem Supermarkt mitgenommen?",
  "Was ist das Dümmste, was du je aus Liebe getan hast?",
  "Hast du jemals einen Kuss oder eine Umarmung falsch interpretiert?",
  "Was ist das Peinlichste, was dir je beim Tanzen passiert ist?",
  "Hast du jemals eine Party verlassen, ohne dich zu verabschieden?",
  "Was ist das Verrückteste, was du je auf Reisen getan hast?",
  "Hast du jemals jemanden bei einem Geheimnis erwischt?",
  "Was ist das Peinlichste, was dir je beim Telefonieren passiert ist?",
  "Hast du jemals einen falschen Namen verwendet?",
  "Was ist das Dümmste, was du je aus Wut getan hast?",
  "Hast du jemals etwas sehr Wertvolles verloren oder kaputt gemacht?",
  "Was ist das Peinlichste, was dir je mit Technologie passiert ist?",
  "Hast du jemals jemanden fälschlicherweise beschuldigt?",
  "Was ist das Verrückteste, was du je aus Neugier getan hast?",
  "Hast du jemals einen Geheimcode oder eine Geheimsprache erfunden?",
  "Was ist das Peinlichste, was dir je mit Essen passiert ist?",
  "Hast du jemals jemanden imitiert, um beliebter zu wirken?",
];

export const getRandomPartyQuestion = (): string => {
  const randomIndex = Math.floor(Math.random() * PARTY_QUESTIONS.length);
  return PARTY_QUESTIONS[randomIndex];
};

export const TRUTH_CATEGORIES = {
  EMBARRASSING: [
    "Was ist das Peinlichste, was dir je in der Öffentlichkeit passiert ist?",
    "Hast du jemals in die Hose gemacht? (Auch als Erwachsener)",
    "Was ist das Peinlichste, was du jemals in einem Chat oder einer Nachricht verschickt hast?",
    "Was ist das Peinlichste, was dir je beim Sport passiert ist?",
    "Was ist das Peinlichste, was du jemals in einem Restaurant erlebt hast?",
  ],
  ILLEGAL: [
    "Hast du jemals etwas gestohlen (auch wenn es nur Kleinigkeiten waren)?",
    "Hast du jemals etwas Illegales getan (auch wenn es nur klein war)?",
    "Hast du jemals Essen geklaut oder ohne zu bezahlen aus einem Supermarkt mitgenommen?",
    "Hast du jemals einen Unfall verursacht und bist einfach weitergefahren?",
    "Hast du jemals einen Fake-Account erstellt, um jemanden zu stalken?",
  ],
  CRAZY: [
    "Was ist das Verrückteste, was du für eine Mutprobe getan hast?",
    "Was ist das Dümmste, was du jemals betrunken getan hast?",
    "Was ist das Verrückteste, was du getan hast, um jemandem zu imponieren?",
    "Was ist das Verrückteste, was du je aus Langeweile getan hast?",
    "Was ist das Verrückteste, was du je auf Reisen getan hast?",
  ],
  PERSONAL: [
    "Hast du jemals bei einer Prüfung oder einem Test geschummelt?",
    "Hast du jemals jemanden heimlich geküsst, ohne dass die Person es wusste?",
    "Hast du jemals jemanden angelogen, um aus einer Verabredung herauszukommen?",
    "Hast du jemals jemanden mit Absicht ignoriert, obwohl du ihn gesehen hast?",
    "Hast du jemals jemanden fälschlicherweise beschuldigt?",
  ],
  RELATIONSHIPS: [
    "Was ist das Peinlichste, was dir je beim Dating passiert ist?",
    "Was ist das Dümmste, was du je aus Liebe getan hast?",
    "Hast du jemals einen Kuss oder eine Umarmung falsch interpretiert?",
    "Hast du jemals jemanden imitiert, um beliebter zu wirken?",
    "Hast du jemals eine Party verlassen, ohne dich zu verabschieden?",
  ]
};

export const getQuestionByCategory = (category: keyof typeof TRUTH_CATEGORIES): string => {
  const questions = TRUTH_CATEGORIES[category];
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};