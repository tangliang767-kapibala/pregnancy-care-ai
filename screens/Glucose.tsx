
import React, { useState, useEffect } from 'react';
import { GlucoseLog } from '../types';

const Glucose: React.FC = () => {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [value, setValue] = useState('');
  const [type, setType] = useState<GlucoseLog['timeType']>('fasting');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
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
  };

  const getStatus = (v: number, t: GlucoseLog['timeType']) => {
    if (t === 'fasting') return v > 5.1 ? '偏高' : '正常';
    if (t === 'postMeal1h') return v > 10.0 ? '偏高' : '正常';
    return v > 8.5 ? '偏高' : '正常';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">血糖监测中心</h1>
        <button onClick={() => setShowImport(!showImport)} className="bg-blue-50 px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-500">
          管理历史
        </button>
      </header>

      {showImport && (
        <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-blue-100 space-y-3 animate-slide-down">
          <textarea 
            value={importData}
            onChange={e => setImportData(e.target.value)}
            className="w-full h-20 bg-blue-50/20 rounded-xl p-3 text-[10px] font-mono outline-none"
            placeholder='粘贴血糖记录 JSON...'
          />
          <button onClick={() => {
            try {
              const p = JSON.parse(importData);
              if(Array.isArray(p)) saveLogs([...p, ...logs]);
              setShowImport(false);
            } catch(e) { alert("数据格式错误"); }
          }} className="w-full bg-blue-500 text-white py-2 rounded-xl text-xs font-bold">导入历史数据</button>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-pink-100/20 border border-white space-y-6">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">检测日期</label>
          <input 
            type="date" 
            value={recordDate} 
            onChange={e => setRecordDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-blue-100"
          />
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {(['fasting', 'postMeal1h', 'postMeal2h'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`flex-1 py-2.5 text-[10px] font-bold rounded-xl transition-all ${type === t ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>
              {t === 'fasting' ? '空腹' : t === 'postMeal1h' ? '餐后1h' : '餐后2h'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
            <input 
              type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="0.0" className="bg-transparent text-4xl font-bold text-gray-800 border-none outline-none w-24"
            />
            <span className="text-xs font-bold text-gray-300">mmol/L</span>
          </div>
          <button onClick={addLog} className="bg-pink-500 text-white font-bold h-16 w-16 rounded-2xl shadow-lg shadow-pink-100 flex items-center justify-center text-xl">
            ＋
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 px-1">监测报告墙</h2>
        {logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-gray-100">
            <p className="text-gray-300 text-sm italic font-medium">还没有血糖记录哦</p>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-gray-50 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`w-1.5 h-10 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-400' : 'bg-rose-400'}`} />
                <div>
                  <div className="flex items-baseline space-x-1">
                    <p className="text-lg font-bold text-gray-800">{log.value}</p>
                    <span className="text-[10px] text-gray-400">mmol/L</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{log.date} • {log.timeType === 'fasting' ? '空腹' : '餐后'}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-50 text-green-500' : 'bg-rose-50 text-rose-500'}`}>
                {getStatus(log.value, log.timeType)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Glucose;
