
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('😊');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('mama_journal_entries');
    if (saved) {
      const parsed = JSON.parse(saved);
      const sorted = parsed.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEntries(sorted);
    }
  };

  const saveToLocal = (newEntries: JournalEntry[]) => {
    // 强制按日期倒序排列：最新的在最上面
    const sorted = [...newEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem('mama_journal_entries', JSON.stringify(sorted));
    setEntries(sorted); // 立即更新状态，触发 UI 刷新
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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm("确定要删除这条历史记录吗？")) {
      const filtered = entries.filter(e => e.id !== id);
      saveToLocal(filtered);
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        saveToLocal([...parsed, ...entries]);
        setShowImport(false);
        setImportData('');
        alert("历史数据导入成功！");
      }
    } catch (e) {
      alert("数据格式不正确，请确保是 JSON 数组格式");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24 bg-[#fef2f2]">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">心情 & 体重记录</h1>
          <p className="text-[10px] text-gray-400 font-medium">历史数据补录已启用</p>
        </div>
        <button 
          onClick={() => setShowImport(!showImport)}
          className="bg-white p-2 px-3 rounded-xl shadow-sm border border-pink-100 text-[10px] text-pink-500 font-bold"
        >
          {showImport ? '关闭工具' : '批量管理'}
        </button>
      </header>

      {/* 导入导出面板 */}
      {showImport && (
        <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-pink-200 space-y-3 animate-slide-down">
          <p className="text-[10px] text-gray-400">在此粘贴过往记录的 JSON 数组进行补录：</p>
          <textarea 
            value={importData}
            onChange={e => setImportData(e.target.value)}
            className="w-full h-20 bg-pink-50/30 rounded-xl p-3 text-[10px] font-mono outline-none border border-pink-50"
            placeholder='[{"date":"2023-12-01","weight":55,"mood":"😊","note":"补录"}]'
          />
          <div className="flex space-x-2">
            <button onClick={handleImport} className="flex-1 bg-pink-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-pink-100">确认导入</button>
            <button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(entries));
              alert("历史记录已复制，可用于迁移或备份");
            }} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-bold">导出备份</button>
          </div>
        </div>
      )}

      {/* 录入表单 */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-pink-100/30 border border-white space-y-5 relative">
        {showSuccess && (
          <div className="absolute inset-0 bg-white/90 rounded-[2.5rem] flex flex-col items-center justify-center z-20 animate-fade-in">
            <span className="text-4xl mb-2">✅</span>
            <p className="text-pink-500 font-bold text-sm">记录已保存到历史列表</p>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">记录日期 (可补录过往)</label>
          <input 
            type="date" 
            value={recordDate} 
            onChange={e => setRecordDate(e.target.value)}
            className="w-full bg-pink-50/50 border-none rounded-2xl p-4 text-sm font-bold text-pink-600 outline-none ring-2 ring-transparent focus:ring-pink-200 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">体重 (KG)</label>
            <input 
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xl font-bold text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
              placeholder="0.0"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">心情</label>
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-2xl appearance-none text-center outline-none"
            >
              <option>😊</option><option>🥰</option><option>😴</option><option>😭</option><option>🤢</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">备注</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm text-gray-600 h-20 outline-none resize-none"
            placeholder="今天感觉怎么样？"
          />
        </div>

        <button 
          onClick={addEntry}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-200 active:scale-95 transition-all"
        >
          保存记录
        </button>
      </div>

      {/* 历史列表展示区 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 px-1 flex justify-between items-center">
          <span>历史足迹</span>
          <span className="text-[10px] font-normal text-gray-400">共 {entries.length} 条</span>
        </h2>
        
        {entries.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center text-center space-y-4">
            <div className="text-5xl opacity-20">📒</div>
            <p className="text-gray-400 text-sm italic">还没有任何记录，尝试补录一个吧！</p>
          </div>
        ) : (
          <div className="relative space-y-4 before:content-[''] before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[1px] before:bg-pink-100">
            {entries.map(entry => (
              <div key={entry.id} className="relative pl-12 animate-slide-up">
                <div className="absolute left-[16px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-pink-400 z-10" />
                <div className="group bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-transparent hover:border-pink-50">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl drop-shadow-sm">{entry.mood}</span>
                    <div>
                      <p className="text-base font-bold text-gray-800">{entry.weight} <span className="text-[10px] font-normal text-gray-400">kg</span></p>
                      <p className="text-[10px] text-pink-400 font-bold">{entry.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="text-[10px] text-gray-400 italic max-w-[100px] truncate">{entry.note || '无备注'}</p>
                    <button onClick={() => deleteEntry(entry.id)} className="p-2 text-rose-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
