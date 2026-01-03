
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('😊');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mama_journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const saveToLocal = (newEntries: JournalEntry[]) => {
    const sorted = [...newEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(sorted);
    localStorage.setItem('mama_journal_entries', JSON.stringify(sorted));
  };

  const addEntry = () => {
    if (!weight) {
      alert("请输入体重数值");
      return;
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: recordDate,
      weight: parseFloat(weight),
      mood,
      note,
    };
    
    saveToLocal([newEntry, ...entries]);
    setWeight('');
    setNote('');
    setMood('😊');
    setIsHistoryMode(false);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm("确定要删除这条历史记录吗？")) {
      saveToLocal(entries.filter(e => e.id !== id));
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        saveToLocal([...parsed, ...entries]);
        setShowImport(false);
        setImportData('');
        alert("导入成功！");
      }
    } catch (e) {
      alert("导入格式错误，请检查 JSON 内容");
    }
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">心情 & 体重记录</h1>
        <button 
          onClick={() => setShowImport(!showImport)}
          className="text-[10px] font-bold text-pink-500 bg-pink-50 px-3 py-1.5 rounded-full"
        >
          {showImport ? '关闭工具' : '导入/导出'}
        </button>
      </div>

      {/* 导入工具 */}
      {showImport && (
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-pink-100 space-y-4 animate-slide-down">
          <p className="text-xs text-gray-400">请粘贴历史数据的 JSON 数组，或点击导出备份数据。</p>
          <textarea 
            value={importData}
            onChange={e => setImportData(e.target.value)}
            className="w-full h-24 bg-gray-50 border-none rounded-xl p-3 text-[10px] font-mono"
            placeholder='[{"date":"2023-10-01","weight":55.5,"mood":"😊","note":"补录数据"}]'
          />
          <div className="flex space-x-2">
            <button onClick={handleImport} className="flex-1 bg-pink-500 text-white text-xs font-bold py-2 rounded-xl">执行导入</button>
            <button onClick={() => {
              const data = JSON.stringify(entries);
              navigator.clipboard.writeText(data);
              alert("已复制到剪贴板！");
            }} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-xl">导出备份</button>
          </div>
        </div>
      )}

      {/* 录入卡片 */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 space-y-5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {isHistoryMode ? '补录历史数据' : '记录今日状态'}
          </span>
          <button 
            onClick={() => setIsHistoryMode(!isHistoryMode)}
            className="text-[10px] text-pink-400 underline underline-offset-4"
          >
            {isHistoryMode ? '回到今天' : '录入历史记录'}
          </button>
        </div>

        {isHistoryMode && (
          <div className="animate-fade-in">
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">选择补录日期</label>
            <input 
              type="date" 
              value={recordDate} 
              onChange={e => setRecordDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm outline-none ring-2 ring-pink-100 focus:ring-pink-300 transition-all"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">今日体重 (kg)</label>
            <input 
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-lg font-bold text-gray-700 outline-none"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">当前心情</label>
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-4 text-2xl appearance-none text-center outline-none"
            >
              <option>😊</option><option>🥰</option><option>😴</option><option>😭</option><option>🤢</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase ml-1">日记备注</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm text-gray-600 h-24 outline-none resize-none"
            placeholder="今天感觉怎么样？"
          />
        </div>

        <button 
          onClick={addEntry}
          className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-100 active:scale-95 transition-all"
        >
          保存记录
        </button>
      </div>

      {/* 体重趋势可视化 */}
      {entries.length > 1 && (
        <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-pink-100">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{changeInfo?.label}</p>
              <p className="text-4xl font-bold">{Math.abs(changeInfo?.diff || 0)} <span className="text-sm font-normal">kg</span></p>
            </div>
            <p className="text-[10px] opacity-70 italic font-medium">累计监测 {entries.length} 天</p>
          </div>
          
          <div className="flex items-end justify-between h-20 px-2 space-x-1">
            {entries.slice(0, 15).reverse().map((e) => {
              const max = Math.max(...entries.map(x => x.weight));
              const min = Math.min(...entries.map(x => x.weight));
              const height = max === min ? 50 : ((e.weight - min) / (max - min)) * 80 + 20;
              return (
                <div key={e.id} className="group relative flex-1 flex flex-col items-center">
                  <div className="w-full bg-white/20 rounded-t-lg transition-all duration-300 group-hover:bg-white/50" style={{ height: `${height}%` }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 历史记录列表 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex justify-between items-center">
          <span>历史数据展示</span>
          <span className="text-[10px] text-gray-400 font-normal">点击记录可管理数据</span>
        </h2>
        {entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-20 grayscale">📒</div>
            <p className="text-sm text-gray-300 italic">还没开始记录哦，补录一点历史数据吧</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="group bg-white p-5 rounded-3xl flex items-center justify-between border border-transparent hover:border-pink-100 shadow-sm transition-all">
              <div className="flex items-center space-x-4">
                <span className="text-3xl drop-shadow-sm">{entry.mood}</span>
                <div>
                  <p className="text-base font-bold text-gray-800">{entry.weight} <span className="text-[10px] font-normal text-gray-400">kg</span></p>
                  <p className="text-[10px] text-gray-500">{entry.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-xs text-gray-400 max-w-[100px] truncate italic">{entry.note}</p>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-500 transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
