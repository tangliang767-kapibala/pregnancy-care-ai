import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPregnancyAdviceStream = async (week: number, question: string) => {
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `我目前怀孕第${week}周。问题：${question}`,
    config: {
      systemInstruction: "你是一个专业的妇产科医生和营养师。请以温和、鼓励的语气回答。请务必使用 Markdown 格式排版，包含清晰的标题、列表和加粗重点。如果涉及医疗建议，请分条列出。如果是严重不适，必须显著提醒及时就医。避免冗长的段落，确保信息一目了然。",
    }
  });
};

export const getDailyTips = async (week: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请为怀孕第${week}周的准妈妈提供三个简短的每日建议：1. 饮食建议 2. 生活注意事项 3. 宝宝发育亮点。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diet: { type: Type.STRING },
          lifestyle: { type: Type.STRING },
          baby: { type: Type.STRING },
        },
        required: ["diet", "lifestyle", "baby"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};