/**
 * פונקציה שממירה אודיו לטקסט
 * @param audio - קובץ אודיו או Blob
 * @returns Promise עם הטקסט שהומר
 */
export const speechToText = async (audio: File | Blob): Promise<string> => {
  // סימולציה של עיכוב רשת
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000)
  );

  // טקסטים רנדומליים בעברית
  const sampleTexts = [
    "שלום, אני רוצה לשאול על React ו-TypeScript",
    "איך אני יכול להתחיל עם Material-UI?",
    "תוכל להסביר לי על Hooks ב-React?",
    "מה ההבדל בין useState ו-useEffect?",
    "איך אני יכול לבנות אפליקציה עם Next.js?",
    "תוכל להסביר לי על Context API?",
    "מה זה Redux ואיך להשתמש בו?",
    "איך אני יכול לבנות API עם Node.js?",
    "תוכל להסביר לי על async/await?",
    "מה זה TypeScript ואיך הוא עוזר?",
    "איך אני יכול לבנות אפליקציה מובייל עם React Native?",
    "מה זה GraphQL ואיך להשתמש בו?",
    "תוכל להסביר לי על Webpack?",
    "איך אני יכול לבנות אפליקציה עם Vue.js?",
    "מה זה Docker ואיך להשתמש בו?",
  ];

  // בחירת טקסט רנדומלי
  const randomText =
    sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

  // סימולציה של שגיאות (10% מהמקרים)
  if (Math.random() < 0.1) {
    throw new Error("לא הצלחתי להבין את האודיו, אנא נסה שוב");
  }

  return randomText;
};

/**
 * פונקציה שממירה אודיו לטקסט עם אפשרות לשפה
 * @param audio - קובץ אודיו או Blob
 * @param language - שפת האודיו (ברירת מחדל: 'he-IL')
 * @returns Promise עם הטקסט שהומר
 */
export const speechToTextWithLanguage = async (
  audio: File | Blob,
  language: string = "he-IL"
): Promise<string> => {
  // סימולציה של עיכוב רשת
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 2000)
  );

  // טקסטים לפי שפה
  const textsByLanguage: Record<string, string[]> = {
    "he-IL": [
      "שלום, אני רוצה לשאול על React ו-TypeScript",
      "איך אני יכול להתחיל עם Material-UI?",
      "תוכל להסביר לי על Hooks ב-React?",
    ],
    "en-US": [
      "Hello, I want to ask about React and TypeScript",
      "How can I get started with Material-UI?",
      "Can you explain Hooks in React?",
    ],
    "es-ES": [
      "Hola, quiero preguntar sobre React y TypeScript",
      "¿Cómo puedo empezar con Material-UI?",
      "¿Puedes explicarme sobre Hooks en React?",
    ],
  };

  const texts = textsByLanguage[language] || textsByLanguage["he-IL"];
  const randomText = texts[Math.floor(Math.random() * texts.length)];

  return randomText;
};
