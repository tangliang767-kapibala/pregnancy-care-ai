
import React, { useEffect, useState } from 'react';
import { PregnancyData } from '../types';
import { FRUIT_SIZES } from '../constants.tsx';
import { getDailyTips } from '../services/geminiService';

interface DashboardProps {
  data: PregnancyData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [tips, setTips] = useState<{ diet: string; lifestyle: string; baby: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const dailyTips = await getDailyTips(data.currentWeek);
        setTips(dailyTips);
      } catch (error) {
        console.error("Failed to fetch tips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [data.currentWeek]);

  const currentFruit = FRUIT_SIZES.reverse().find(f => data.currentWeek >= f.week) || FRUIT_SIZES[0];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">早安，准妈妈</h1>
          <p className="text-gray-500 text-sm">宝宝正在努力长大呢</p>
        </div>
        <div className="bg-pink-100 p-2 rounded-full text-pink-500">
          ✨
        </div>
      </header>

      {/* Pregnancy Status Card */}
      <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-6xl font-bold">{data.currentWeek}</span>
            <span className="text-xl ml-1">周</span>
          </div>
          <div className="text-right">
            <p className="opacity-80 text-sm">距离预产期</p>
            <p className="text-2xl font-bold">{data.daysRemaining} 天</p>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2 mb-6">
          <div 
            className="bg-white h-full rounded-full transition-all duration-1000" 
            style={{ width: `${(data.currentWeek / 40) * 100}%` }}
          />
        </div>

        <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl">
          <div className="text-4xl">{currentFruit.icon}</div>
          <div>
            <p className="text-sm opacity-90">此时宝宝大约像个</p>
            <p className="font-bold text-lg">{currentFruit.name}</p>
          </div>
        </div>
      </div>

      {/* AI Daily Tips Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">💡</span> 今日建议
        </h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <TipCard icon="🍎" title="饮食建议" content={tips?.diet} />
            <TipCard icon="🛌" title="生活注意" content={tips?.lifestyle} />
            <TipCard icon="👶" title="宝宝变化" content={tips?.baby} />
          </div>
        )}
      </section>

      <div className="h-20" /> {/* Spacer for nav */}
    </div>
  );
};

const TipCard: React.FC<{ icon: string, title: string, content?: string }> = ({ icon, title, content }) => (
  <div className="bg-white p-4 rounded-2xl border border-pink-50 shadow-sm flex items-start space-x-3">
    <div className="text-2xl">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{content || '获取建议中...'}</p>
    </div>
  </div>
);

export default Dashboard;
