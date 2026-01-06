
import React, { useState, useRef, useEffect } from 'react';
import { getPregnancyAdviceStream } from '../services/geminiService';
import { marked } from 'marked';
import { User } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  "本周要注意什么？",
  "能喝咖啡吗？",
  "如何缓解腰痛？",
  "宝宝现在有多大？"
];

const Chat: React.FC<{ user: User, currentWeek: number }> = ({ user, currentWeek }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `${user.nickname}，你好！我是你的专属AI助手。作为${user.age}岁的准妈妈，目前在第${currentWeek}周，有什么问题想问我吗？` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processStream = async (userMsg: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = await getPregnancyAdviceStream(user, currentWeek, userMsg);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: fullText };
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat process error:", error);
      let errorMsg = '服务繁忙，请稍后再试。';
      if (error.message === "API_KEY_MISSING") {
        errorMsg = '⚠️ 错误：未配置 API Key。请在 Vercel Settings -> Environment Variables 中添加 VITE_API_KEY。';
      } else if (error.message?.includes('403')) {
        errorMsg = '⚠️ 权限错误：API Key 无效或权限受限。';
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'assistant', content: errorMsg };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    processStream(input.trim());
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b border-pink-50 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span> AI 孕期助手
        </h1>
        <p className="text-[10px] text-gray-400 mt-0.5">为 {user.nickname} 实时守护 • W{currentWeek}</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' ? 'bg-pink-500 text-white shadow-md rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none prose prose-pink'
            }`}>
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || (isLoading && idx === messages.length - 1 ? '...' : '')) }} />
              ) : msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex overflow-x-auto space-x-2 no-scrollbar">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => !isLoading && processStream(q)} className="whitespace-nowrap bg-white border border-pink-100 text-pink-500 text-xs px-3 py-1.5 rounded-full shadow-sm">
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl shadow-lg border border-pink-50">
            <input 
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="咨询您的 AI 助手..."
              className="flex-1 bg-transparent border-none outline-none p-2 text-sm text-gray-700"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-500 text-white">
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
