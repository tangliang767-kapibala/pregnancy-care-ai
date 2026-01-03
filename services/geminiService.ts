
import { GoogleGenAI, Type } from "@google/genai";
import { User, GlucoseLog, ReportLog } from "../types";

// Fix: Always use named parameter { apiKey: process.env.API_KEY } directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 产检报告分析
export const analyzeMaternityReport = async (user: User, reportText: string, imageData?: string) => {
  const parts: any[] = [{ text: `用户：${user.nickname}，孕周信息及健康背景：${user.healthNotes}。请分析这份产检报告内容：${reportText}` }];
  
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1],
      },
    });
  }

  // Fix: Upgraded to gemini-3-pro-preview for complex medical reasoning and data extraction
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      systemInstruction: "你是一个资深的妇产科专家。请分析用户的产检报告（文本或图片）。1. 提取关键指标（如HCG, 孕酮, 血糖, 血压, B超结果等）；2. 用通俗易懂的语言解释这些指标代表什么；3. 给出后续的生活或复查建议；4. 语气要专业且充满人文关怀。如果有异常风险，请加粗提醒及时咨询主治医生。",
    }
  });
  return response.text;
};

// 生成综合周度健康报告
export const generateWeeklySummary = async (user: User, week: number, recentWeight: number[], recentGlucose: GlucoseLog[]) => {
  const glucoseStr = recentGlucose.map(g => `${g.timeType}: ${g.value}`).join(', ');
  const weightStr = recentWeight.join(' -> ');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请为${user.nickname}生成第${week}周的综合孕期周报。近期体重趋势：${weightStr}，近期血糖记录：${glucoseStr}。基础病史：${user.healthNotes}`,
    config: {
      systemInstruction: "你是一个孕期健康管理专家。请生成一份精美的Markdown格式周度报告。包含：1. 怀孕进展总结；2. 营养与运动建议；3. 体重与血糖趋势评估；4. 下周重要待办事项。语气要温馨。使用丰富的Emoji使内容易读。",
    }
  });
  return response.text;
};

export const getPregnancyAdviceStream = async (user: User, week: number, question: string) => {
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
  return await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: `我是${user.nickname}，${user.age}岁。BMI: ${bmi}。健康背景：${user.healthNotes}。第${week}周。问题：${question}`,
    config: {
      systemInstruction: "你是一个专业的妇产科医生和营养师。请根据用户提供的指标提供深度个性化的回答，包含Markdown格式排版。",
    }
  });
};

export const getDailyTips = async (week: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `怀孕第${week}周，提供：1. 饮食建议 2. 生活注意事项 3. 宝宝发育亮点。`,
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
