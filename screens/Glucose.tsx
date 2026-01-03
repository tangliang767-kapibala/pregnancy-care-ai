
import React, { useState, useEffect } from 'react';
import { GlucoseLog } from '../types';

const Glucose: React.FC = () => {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [value, setValue] = useState('');
  const [type, setType] = useState<GlucoseLog['timeType']>('fasting');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mama_glucose_logs');
    if (saved) {
      setLogs(JSON.parse(saved).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const saveLogs = (newLogs: GlucoseLog[]) => {
    const sorted = [...newLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLogs(sorted);
    localStorage.setItem('mama_glucose_logs', JSON.stringify(sorted));
  };

  const addLog = () => {
    if (!value) return;
    const newLog: GlucoseLog = {
      id: Date.now().toString(),
      date: recordDate,
      timeType: type,
      value: parseFloat(value)
    };
    saveLogs([newLog, ...logs]);
    setValue('');
    setIsHistoryMode(false);
  };

  const deleteLog = (id: string) => {
    if (window.confirm("确认删除这条记录吗？")) {
      saveLogs(logs.filter(l => l.id !== id));
    }
  };

  const getStatus = (v: number, t: GlucoseLog['timeType']) => {
    if (t === 'fasting') return v > 5.1 ? '偏高' : '正常';
    if (t === 'postMeal1h') return v > 10.0 ? '偏高' : '正常';
    return v > 8.5 ? '偏高' : '正常';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">血糖监测中心</h1>
        <button onClick={() => setShowImport(!showImport)} className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full">
          数据管理
        </button>
      </div>

      {showImport && (
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-blue-100 space-y-4 animate-slide-down">
          <textarea 
            value={importData}
            onChange={e => setImportData(e.target.value)}
            className="w-full h-24 bg-gray-50 border-none rounded-xl p-3 text-[10px] font-mono"
            placeholder='JSON 批量补录...'
          />
          <div className="flex space-x-2">
            <button onClick={() => {
              try {
                const p = JSON.parse(importData);
                if(Array.isArray(p)) saveLogs([...p, ...logs]);
                setShowImport(false);
              } catch(e) { alert("格式错误"); }
            }} className="flex-1 bg-blue-500 text-white text-xs font-bold py-2 rounded-xl">导入</button>
            <button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(logs));
              alert("已导出");
            }} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-xl">导出</button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 space-y-5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isHistoryMode ? '补录过去数据' : '记录最新血糖'}</span>
          <button onClick={() => setIsHistoryMode(!isHistoryMode)} className="text-[10px] text-blue-400 underline">{isHistoryMode ? '记此刻' : '记历史'}</button>
        </div>

        {isHistoryMode && (
          <input 
            type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm ring-2 ring-blue-50"
          />
        )}

        <div className="flex bg-gray-50 p-1 rounded-2xl">
          {(['fasting', 'postMeal1h', 'postMeal2h'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${type === t ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>
              {t === 'fasting' ? '空腹' : t === 'postMeal1h' ? '餐后1h' : '餐后2h'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input 
              type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="0.0" className="w-full text-4xl font-bold text-gray-800 border-none bg-transparent outline-none"
            />
          </div>
          <button onClick={addLog} className="bg-pink-500 text-white font-bold px-8 h-14 rounded-2xl shadow-lg shadow-pink-100 active:scale-95">保存</button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-gray-800">数据展示墙</h2>
        {logs.map(log => (
          <div key={log.id} className="group bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
            <div className="flex items-center space-x-3">
              <div className={`w-1.5 h-8 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-400' : 'bg-rose-400'}`} />
              <div>
                <p className="text-sm font-bold text-gray-700">{log.value} <span className="text-[10px] font-normal text-gray-400">mmol/L</span></p>
                <p className="text-[10px] text-gray-400">{log.date} • {log.timeType === 'fasting' ? '空腹' : '餐后'}</p>
              </div>
            </div>
            <button onClick={() => deleteLog(log.id)} className="opacity-0 group-hover:opacity-100 text-xs text-rose-300">删除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glucose;
