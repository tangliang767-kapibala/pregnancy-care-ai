
import React, { useState } from 'react';
import { JournalEntry } from '../types';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('😊');

  const addEntry = () => {
    if (!weight) return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      weight: parseFloat(weight),
      mood,
      note,
    };
    setEntries([newEntry, ...entries]);
    setWeight('');
    setNote('');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">心情 & 体重记录</h1>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">今日体重 (kg)</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-lg font-bold text-gray-700 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              placeholder="0.0"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">当前心情</label>
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
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">日记备注</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-600 h-20 outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            placeholder="今天感觉怎么样？"
          />
        </div>

        <button 
          onClick={addEntry}
          className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-all"
        >
          保存记录
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">历史记录</h2>
        {entries.length === 0 ? (
          <div className="text-center py-10 text-gray-300">
            <div className="text-4xl mb-2">📒</div>
            <p className="text-sm">还没开始记录哦</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{entry.mood}</span>
                <div>
                  <p className="text-sm font-bold text-gray-700">{entry.weight} kg</p>
                  <p className="text-[10px] text-gray-400">{entry.date}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 max-w-[50%] truncate">{entry.note}</p>
            </div>
          ))
        )}
      </div>

      <div className="h-20" />
    </div>
  );
};

export default Journal;
