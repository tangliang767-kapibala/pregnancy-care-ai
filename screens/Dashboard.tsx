
import React, { useEffect, useState } from 'react';
import { User, Task, GlucoseLog, AppScreen } from '../types';
import { FRUIT_SIZES, INITIAL_CHECKUPS } from '../constants.tsx';
import { getDailyTips, generateWeeklySummary } from '../services/geminiService';
import { calculatePregnancyData } from '../utils/pregnancyUtils';
import { marked } from 'marked';

interface DashboardProps {
  user: User;
  setScreen: (screen: AppScreen) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setScreen }) => {
  const [tips, setTips] = useState<{ diet: string; lifestyle: string; baby: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const pregData = calculatePregnancyData(user.lastPeriodDate);
  const currentFruit = FRUIT_SIZES.slice().reverse().find(f => pregData.currentWeek >= f.week) || FRUIT_SIZES[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "早安，加油准妈妈";
    if (hour < 14) return "午安，记得午睡一会儿哦";
    if (hour < 19) return "下午好，补充点坚果或水果吧";
    return "晚安，早点休息，宝宝也在休息了";
  };

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const dailyTips = await getDailyTips(pregData.currentWeek);
        setTips(dailyTips);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [pregData.currentWeek]);

  // 生成周度报告
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      // 模拟获取最近数据
      const mockWeights = [user.weight, user.weight + 0.5];
      const result = await generateWeeklySummary(user, pregData.currentWeek, mockWeights, []);
      setSummary(result);
    } catch (e) {
      alert("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const tasks: Task[] = [
    { id: 't1', title: '测量今日血糖', type: 'glucose', dueDate: '今天', isDone: false, week: pregData.currentWeek },
    { id: 't2', title: `第${pregData.currentWeek + 1}周产检预约`, type: 'checkup', dueDate: '下周', isDone: false, week: pregData.currentWeek },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}</h1>
          <p className="text-pink-500 font-medium">{user.nickname}，今天也要好心情 ✨</p>
        </div>
        <button onClick={() => { localStorage.removeItem('mama_user'); window.location.reload(); }} className="p-2 bg-white rounded-full shadow-sm text-xs">退出</button>
      </header>

      {/* 核心进度 */}
      <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-[2.5rem] p-6 text-white shadow-xl shadow-pink-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-baseline">
              <span className="text-7xl font-bold tracking-tighter">{pregData.currentWeek}</span>
              <span className="text-xl ml-1 font-medium opacity-80">周</span>
            </div>
            <p className="text-sm font-medium opacity-70 mt-1">宝宝约 {currentFruit.name} 大小</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">预产期倒计时</p>
            <p className="text-3xl font-bold">{pregData.daysRemaining}</p>
            <p className="text-[10px] opacity-70">天</p>
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 flex items-center space-x-4">
          <span className="text-4xl">{currentFruit.icon}</span>
          <div className="flex-1">
            <p className="text-xs opacity-80">本周重要提醒：</p>
            <p className="font-bold text-sm">关注下肢水肿，减少盐分摄入</p>
          </div>
        </div>
      </div>

      {/* 智能待办模块 */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 flex items-center">
            <span className="mr-2 text-pink-500">📌</span> 下一步重要事项
          </h2>
          <span className="text-[10px] text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">待办 2</span>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-transparent active:border-pink-200 transition-all">
              <div className={`w-5 h-5 rounded-full border-2 ${task.isDone ? 'bg-pink-500 border-pink-500' : 'border-gray-200'} flex items-center justify-center`}>
                {task.isDone && <span className="text-white text-[10px]">✓</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${task.isDone ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{task.title}</p>
                <p className="text-[10px] text-gray-400">{task.dueDate}</p>
              </div>
              <button 
                onClick={() => task.type === 'glucose' ? setScreen(AppScreen.GLUCOSE) : setScreen(AppScreen.CHECKUPS)}
                className="text-pink-500 text-[10px] font-bold"
              >去完成</button>
            </div>
          ))}
        </div>
      </section>

      {/* AI 周度报告生成入口 */}
      <section className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="font-bold text-blue-900 text-lg">W{pregData.currentWeek} 深度健康评估</h2>
            <p className="text-blue-600 text-xs">聚合体重、血糖及产检数据生成专业报告</p>
          </div>
          <button 
            disabled={isGenerating}
            onClick={handleGenerateSummary}
            className={`px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-200 ${isGenerating ? 'opacity-50' : ''}`}
          >
            {isGenerating ? '分析中...' : '生成周报'}
          </button>
        </div>

        {summary && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-blue-50 max-h-60 overflow-y-auto prose prose-sm text-xs no-scrollbar" dangerouslySetInnerHTML={{ __html: marked.parse(summary) }} />
        )}
      </section>

      {/* 每日三点式建议 */}
      <section className="grid grid-cols-1 gap-4">
         <h2 className="font-bold text-gray-800 px-1">💡 每日妈妈锦囊</h2>
         {loading ? <div className="h-20 bg-gray-100 rounded-3xl animate-pulse" /> : (
           <>
            <TipCard icon="🥗" title="怎么吃" content={tips?.diet} />
            <TipCard icon="👣" title="怎么动" content={tips?.lifestyle} />
            <TipCard icon="🌟" title="宝宝在干嘛" content={tips?.baby} />
           </>
         )}
      </section>
    </div>
  );
};

const TipCard: React.FC<{ icon: string, title: string, content?: string }> = ({ icon, title, content }) => (
  <div className="bg-white p-5 rounded-3xl border border-pink-50 flex items-start space-x-4 shadow-sm">
    <div className="text-3xl">{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-800 text-sm mb-0.5">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{content}</p>
    </div>
  </div>
);

export default Dashboard;
