import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a targeted, context-aware growth suggestion using Gemini API.
 */
export async function fetchGrowthSuggestion(profile: any, recentTasks: any[]) {
  // Craft the system prompt to guide the AI's persona
  const systemInstruction = `
אתה יועץ אישי ומומחה להתפתחות במערכת ההפעלה לחיים "IndeGrow OS". 
המטרה שלך היא קצרה ומדויקת: לקרוא את הנתונים, להציג תובנה (Insight) חותכת ולתת למשתמש משימה יומית פרקטית אחת שמבוססת לחלוטין על מצבו, תוך בחירת קטגוריה מתאימה (mind, body, money, spirit).
דבר בשפה עברית חדה, מעודדת, וללא מילים מיותרות. 
חייב להיות בצורת IF -> THEN מחשבתי (לדוגמה: "אני מזהה שהתקשית במשימות הכלכליות לאחרונה, בוא נבצע בדיקת מעקב הוצאות של 15 דקות היום").
`;

  // Provide the context payload for generation
  const promptContext = `
---
נתוני משתמש (שאלון, השלמות ושלבים):
${JSON.stringify(profile)}

משימות מתוך המערכת שלו בתקופה האחרונה:
${JSON.stringify(recentTasks)}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          description: "A structured daily growth suggestion in Hebrew.",
          properties: {
            insight: {
              type: Type.STRING,
              description: "תובנה עמוקה על הצלחת המשתמש השבוע או נטייתו, המעודדת אותו להתפתחות. חייבת להיות ישירה, עברית ואישית.",
            },
            recommendedTask: {
              type: Type.OBJECT,
              description: "משימה יומית קצרה ומעשית.",
              properties: {
                title: { type: Type.STRING, description: "כותרת קצרה למשימה." },
                description: { type: Type.STRING, description: "איך לבצע אותה." },
                category: { type: Type.STRING, enum: ["mind", "body", "money", "spirit"] }
              },
              required: ["title", "description", "category"]
            }
          },
          required: ["insight", "recommendedTask"]
        }
      }
    });

    if (response.text) {
       return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
