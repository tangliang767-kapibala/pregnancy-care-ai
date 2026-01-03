
import { GoogleGenAI, Type } from "@google/genai";
import { User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPregnancyAdviceStream = async (user: User, week: number, question: string) => {
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `我是${user.nickname}，${user.age}岁。
身体指标：身高${user.height}cm，初始体重${user.weight}kg (BMI: ${bmi})。
健康背景：${user.healthNotes}。
当前孕周：第${week}周。
问题：${question}`,
    config: {
      systemInstruction: "你是一个专业的妇产科医生和营养师。请根据用户提供的详细身体指标（年龄、BMI、基础疾病）提供深度个性化的回答。若用户有基础疾病（如血糖问题），在建议饮食和运动时需格外谨慎且具有针对性。请以温和、鼓励的语气回答，使用 Markdown 格式。高龄或有基础病风险时，必须显著提醒医学检查的重要性。避免冗长，确保信息专业且易懂。",
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
