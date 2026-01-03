import React, { useState, useRef, useEffect } from 'react';
import { getPregnancyAdviceStream } from '../services/geminiService';
import { marked } from 'marked';

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

const Chat: React.FC<{ currentWeek: number }> = ({ currentWeek }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '准妈妈，你好！我是你的专属AI育儿助手。有什么关于孕期、饮食或宝宝发育的问题，尽管问我吧。' }
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

    // Add an empty assistant message to fill as chunks arrive
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = await getPregnancyAdviceStream(currentWeek, userMsg);
      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: fullText 
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: '网络有点忙，请稍后再试。' 
        };
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

  const renderContent = (content: string) => {
    const html = marked.parse(content);
    return { __html: html };
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b border-pink-50 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span> AI 孕期助手
        </h1>
        <p className="text-[10px] text-gray-400 mt-0.5">实时专业建议 • 已开启 W{currentWeek} 指导</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[88%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-pink-500 text-white rounded-tr-none shadow-md shadow-pink-100' 
                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none prose prose-pink'
            }`}>
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={renderContent(msg.content || (isLoading && idx === messages.length - 1 ? '正在思考中...' : ''))} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="max-w-md mx-auto space-y-3">
          {/* Quick Questions Chips */}
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide no-scrollbar">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => !isLoading && processStream(q)}
                className="whitespace-nowrap bg-white border border-pink-100 text-pink-500 text-xs px-3 py-1.5 rounded-full shadow-sm active:bg-pink-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl shadow-lg border border-pink-50">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="问问宝宝或身体变化..."
              className="flex-1 bg-transparent border-none outline-none p-2 text-sm text-gray-700 placeholder-gray-400"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isLoading ? 'bg-gray-100 text-gray-400' : 'bg-pink-500 text-white shadow-md shadow-pink-200 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;