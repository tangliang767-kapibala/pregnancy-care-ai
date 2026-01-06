
import { GoogleGenAI, Type } from "@google/genai";
import { User, GlucoseLog } from "../types";

/**
 * 智能获取 API Key
 * 尝试从不同的可能位置获取，以适配本地、Vercel 以及不同的打包环境
 */
const getApiKey = () => {
  // @ts-ignore - 兼容 Vite
  const viteKey = import.meta.env?.VITE_API_KEY;
  // @ts-ignore - 兼容标准 process.env
  const processKey = typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  
  return viteKey || processKey;
};

const getAIInstance = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Critical: API_KEY is missing. Please set VITE_API_KEY in your environment variables.");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

// 产检报告分析
export const analyzeMaternityReport = async (user: User, reportText: string, imageData?: string) => {
  try {
    const ai = getAIInstance();
    const parts: any[] = [{ text: `用户：${user.nickname}，孕周信息及健康背景：${user.healthNotes}。请分析这份产检报告内容：${reportText}` }];
    
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData.split(',')[1],
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: "你是一个资深的妇产科专家。请分析用户的产检报告。1. 提取关键指标；2. 解释指标含义；3. 给出后续建议；4. 语气要专业且充满人文关怀。",
      }
    });
    return response.text;
  } catch (e: any) {
    console.error("AI Analysis Error:", e);
    if (e.message === "API_KEY_MISSING") return "错误：未检测到 API Key。请在 Vercel 项目设置中添加环境变量 VITE_API_KEY。";
    return `分析出错：${e.message || "未知原因"}`;
  }
};

// 生成综合周度健康报告
export const generateWeeklySummary = async (user: User, week: number, recentWeight: number[], recentGlucose: GlucoseLog[]) => {
  try {
    const ai = getAIInstance();
    const glucoseStr = recentGlucose.map(g => `${g.timeType}: ${g.value}`).join(', ');
    const weightStr = recentWeight.join(' -> ');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请为${user.nickname}生成第${week}周健康报告。体重：${weightStr}，血糖：${glucoseStr}。`,
      config: {
        systemInstruction: "你是一个孕期健康管理专家。请生成 Markdown 格式的周度报告，语气温馨。",
      }
    });
    return response.text;
  } catch (e: any) {
    console.error("Weekly Summary Error:", e);
    return e.message === "API_KEY_MISSING" ? "请先配置 API Key" : "服务暂时不可用";
  }
};

export const getPregnancyAdviceStream = async (user: User, week: number, question: string) => {
  try {
    const ai = getAIInstance();
    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
    return await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: `用户：${user.nickname}，W${week}。问题：${question}`,
      config: {
        systemInstruction: "你是一个专业的妇产科助手。请回答用户问题并保持温馨专业。",
      }
    });
  } catch (e: any) {
    console.error("Stream Error:", e);
    throw e;
  }
};

export const getDailyTips = async (week: number) => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `怀孕第${week}周建议。`,
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
  } catch (e) {
    return { diet: "注意均衡营养", lifestyle: "保持心情愉悦", baby: "正在健康成长" };
  }
};
