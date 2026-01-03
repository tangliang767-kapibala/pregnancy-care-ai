
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('😊');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem('mama_journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const addEntry = () => {
    if (!weight) return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: recordDate,
      weight: parseFloat(weight),
      mood,
      note,
    };
    
    const updatedEntries = [newEntry, ...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(updatedEntries);
    localStorage.setItem('mama_journal_entries', JSON.stringify(updatedEntries));
    
    setWeight('');
    setNote('');
    setRecordDate(new Date().toISOString().split('T')[0]);
  };

  // 简单的体重趋势分析
  const getWeightChange = () => {
    if (entries.length < 2) return null;
    const current = entries[0].weight;
    const earliest = entries[entries.length - 1].weight;
    const diff = (current - earliest).toFixed(1);
    return { diff: parseFloat(diff), label: parseFloat(diff) >= 0 ? '累计增重' : '累计减轻' };
  };

  const changeInfo = getWeightChange();

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24">
      <h1 className="text-2xl font-bold text-gray-800">心情 & 体重记录</h1>

      {/* 补录与新增卡片 */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">记录日期</label>
            <input 
              type="date" 
              value={recordDate} 
              onChange={e => setRecordDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">体重 (kg)</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-lg font-bold text-gray-700 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              placeholder="0.0"
            />
          </div>
          <div className="">
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">当前心情</label>
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-2xl appearance-none text-center outline-none"
            >
              <option>😊</option>
              <option>🥰</option>
              <option>😴</option>
              <option>😭</option>
              <option>🤢</option>
              <option>🍕</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">日记备注</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-600 h-20 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            placeholder="今天感觉怎么样？"
          />
        </div>

        <button 
          onClick={addEntry}
          className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 active:scale-95 transition-all"
        >
          保存记录
        </button>
      </div>

      {/* 体重趋势可视化模块 */}
      {entries.length > 1 && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{changeInfo?.label}</p>
              <p className="text-3xl font-bold">{Math.abs(changeInfo?.diff || 0)} <span className="text-sm font-normal">kg</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">记录跨度</p>
              <p className="text-lg font-bold">{(new Date(entries[0].date).getTime() - new Date(entries[entries.length-1].date).getTime()) / (1000*60*60*24) + 1} <span className="text-xs font-normal">天</span></p>
            </div>
          </div>
          
          {/* 简易 CSS 趋势图 */}
          <div className="flex items-end justify-between h-20 px-2 space-x-1">
            {entries.slice(0, 10).reverse().map((e, i) => {
              const max = Math.max(...entries.map(x => x.weight));
              const min = Math.min(...entries.map(x => x.weight));
              const height = max === min ? 50 : ((e.weight - min) / (max - min)) * 80 + 20;
              return (
                <div key={e.id} className="group relative flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-white/30 rounded-t-lg transition-all duration-500 group-hover:bg-white" 
                    style={{ height: `${height}%` }}
                  />
                  <div className="hidden group-hover:block absolute -top-8 bg-white text-indigo-600 text-[8px] font-bold py-1 px-2 rounded-md shadow-lg z-10">
                    {e.weight}kg
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[8px] mt-4 opacity-50 uppercase tracking-tighter italic">近10次体重波动趋势</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex justify-between items-center">
          <span>历史时光</span>
          <span className="text-xs text-pink-400 font-medium">长按可管理数据</span>
        </h2>
        {entries.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4 grayscale opacity-30">📓</div>
            <p className="text-sm font-medium italic">空空如也，从补录第一天开始吧</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <span className="text-3xl filter drop-shadow-sm">{entry.mood}</span>
                <div>
                  <p className="text-base font-bold text-gray-800">{entry.weight} <span className="text-[10px] font-normal text-gray-400">kg</span></p>
                  <p className="text-[10px] text-gray-500 font-medium">{entry.date}</p>
                </div>
              </div>
              <div className="max-w-[40%] text-right">
                <p className="text-xs text-gray-400 truncate italic">{entry.note || '这一天只想静静...'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="h-20" />
    </div>
  );
};

export default Journal;
