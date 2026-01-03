
import React, { useEffect, useState } from 'react';
import { User, PregnancyData } from '../types';
import { FRUIT_SIZES } from '../constants.tsx';
import { getDailyTips } from '../services/geminiService';
import { calculatePregnancyData } from '../utils/pregnancyUtils';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tips, setTips] = useState<{ diet: string; lifestyle: string; baby: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pregData = calculatePregnancyData(user.lastPeriodDate);
  const currentFruit = FRUIT_SIZES.slice().reverse().find(f => pregData.currentWeek >= f.week) || FRUIT_SIZES[0];

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const dailyTips = await getDailyTips(pregData.currentWeek);
        setTips(dailyTips);
      } catch (error) {
        console.error("Failed to fetch tips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [pregData.currentWeek]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">你好，{user.nickname}</h1>
          <p className="text-gray-500 text-xs mt-0.5">基础代谢良好 • 注意休息</p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('mama_user'); window.location.reload(); }} 
          className="text-[10px] font-bold text-pink-400 border border-pink-100 px-3 py-1.5 rounded-full hover:bg-pink-50 active:scale-95 transition-all"
        >
          退出
        </button>
      </header>

      {/* 快速健康摘要 */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
        <HealthBadge label="BMI" value={(user.weight / ((user.height / 100) ** 2)).toFixed(1)} />
        <HealthBadge label="年龄" value={user.age + '岁'} />
        <HealthBadge label="风险" value={user.healthNotes === '无' ? '低' : '需关注'} />
      </div>

      <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-7xl font-bold tracking-tighter">{pregData.currentWeek}</span>
            <span className="text-xl ml-1 font-medium opacity-80">周</span>
          </div>
          <div className="text-right">
            <p className="opacity-70 text-[10px] font-bold uppercase tracking-widest">距离预产期</p>
            <p className="text-2xl font-bold">{pregData.daysRemaining} <span className="text-sm font-medium">天</span></p>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-6 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${(pregData.currentWeek / 40) * 100}%` }}
          />
        </div>

        <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-4xl filter drop-shadow-sm">{currentFruit.icon}</div>
          <div>
            <p className="text-[10px] opacity-70 font-bold uppercase">宝宝大小比照</p>
            <p className="font-bold text-lg">{currentFruit.name}</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2 p-1 bg-pink-100 rounded-lg text-pink-500 text-sm">✨</span> AI 深度建议
        </h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <TipCard icon="🍎" title="定制饮食" content={tips?.diet} />
            <TipCard icon="🛌" title="生活指南" content={tips?.lifestyle} />
            <TipCard icon="👶" title="成长足迹" content={tips?.baby} />
          </div>
        )}
      </section>

      <div className="h-20" />
    </div>
  );
};

const HealthBadge: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="bg-white border border-pink-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[80px] shadow-sm">
    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{label}</span>
    <span className="text-xs font-bold text-gray-700">{value}</span>
  </div>
);

const TipCard: React.FC<{ icon: string, title: string, content?: string }> = ({ icon, title, content }) => (
  <div className="bg-white p-5 rounded-3xl border border-pink-50 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
    <div className="text-3xl p-2 bg-gray-50 rounded-2xl">{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{content || '正在生成智能建议...'}</p>
    </div>
  </div>
);

export default Dashboard;
