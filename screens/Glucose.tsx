
import React, { useState } from 'react';
import { GlucoseLog } from '../types';

const Glucose: React.FC = () => {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [value, setValue] = useState('');
  const [type, setType] = useState<GlucoseLog['timeType']>('fasting');

  const addLog = () => {
    if (!value) return;
    const newLog: GlucoseLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      timeType: type,
      value: parseFloat(value)
    };
    setLogs([newLog, ...logs]);
    setValue('');
  };

  const getStatus = (v: number, t: GlucoseLog['timeType']) => {
    if (t === 'fasting') return v > 5.1 ? '偏高' : '正常';
    if (t === 'postMeal1h') return v > 10.0 ? '偏高' : '正常';
    return v > 8.5 ? '偏高' : '正常';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in pb-24">
      <h1 className="text-2xl font-bold text-gray-800">血糖监测中心</h1>
      
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 space-y-5">
        <div className="flex bg-gray-50 p-1 rounded-2xl">
          <button onClick={() => setType('fasting')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${type === 'fasting' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>空腹</button>
          <button onClick={() => setType('postMeal1h')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${type === 'postMeal1h' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>餐后1h</button>
          <button onClick={() => setType('postMeal2h')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${type === 'postMeal2h' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>餐后2h</button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input 
              type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="0.0" className="w-full text-4xl font-bold text-gray-800 border-none bg-transparent outline-none placeholder-gray-100"
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">mmol/L</span>
          </div>
          <button onClick={addLog} className="bg-pink-500 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-pink-100 active:scale-95 transition-all">记录</button>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
        <p className="text-[10px] text-amber-800 font-bold uppercase mb-1">💡 知识点</p>
        <p className="text-xs text-amber-600 leading-relaxed">妊娠期糖代谢较为敏感，空腹建议 &le; 5.1，餐后1小时 &le; 10.0，餐后2小时 &le; 8.5。</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-gray-800">历史记录</h2>
        {logs.length === 0 ? <p className="text-center py-10 text-gray-300 text-sm">暂无数据</p> : (
          logs.map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-10 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-400' : 'bg-orange-400'}`} />
                <div>
                  <p className="text-sm font-bold text-gray-700">{log.value} mmol/L</p>
                  <p className="text-[10px] text-gray-400">{log.timeType === 'fasting' ? '空腹' : '餐后'} • {log.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
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
