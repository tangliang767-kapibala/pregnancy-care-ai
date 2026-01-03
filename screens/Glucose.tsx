
import React, { useState, useEffect } from 'react';
import { GlucoseLog } from '../types';

const Glucose: React.FC = () => {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [value, setValue] = useState('');
  const [type, setType] = useState<GlucoseLog['timeType']>('fasting');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  // 初始化加载本地存储
  useEffect(() => {
    const saved = localStorage.getItem('mama_glucose_logs');
    if (saved) {
      setLogs(JSON.parse(saved).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const addLog = () => {
    if (!value) return;
    const newLog: GlucoseLog = {
      id: Date.now().toString(),
      date: recordDate,
      timeType: type,
      value: parseFloat(value)
    };
    
    const updatedLogs = [newLog, ...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLogs(updatedLogs);
    localStorage.setItem('mama_glucose_logs', JSON.stringify(updatedLogs));
    setValue('');
    // 成功后重置为今天，方便下次记录
    setRecordDate(new Date().toISOString().split('T')[0]);
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
          <button onClick={() => setType('fasting')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === 'fasting' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>空腹</button>
          <button onClick={() => setType('postMeal1h')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === 'postMeal1h' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>餐后1h</button>
          <button onClick={() => setType('postMeal2h')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${type === 'postMeal2h' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}>餐后2h</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">测量日期 (支持补录历史)</label>
            <input 
              type="date" 
              value={recordDate} 
              onChange={e => setRecordDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">数值 (mmol/L)</label>
              <input 
                type="number" value={value} onChange={e => setValue(e.target.value)}
                placeholder="0.0" className="w-full text-3xl font-bold text-gray-800 border-none bg-gray-50 rounded-xl p-3 outline-none"
              />
            </div>
            <button onClick={addLog} className="bg-pink-500 text-white font-bold px-8 h-[58px] mt-5 rounded-2xl shadow-lg shadow-pink-100 active:scale-95 transition-all">记录</button>
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-[10px] text-blue-400 font-bold uppercase">最高血糖</p>
            <p className="text-xl font-bold text-blue-700">{Math.max(...logs.map(l => l.value))} <span className="text-xs">mmol/L</span></p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
            <p className="text-[10px] text-green-400 font-bold uppercase">异常记录</p>
            <p className="text-xl font-bold text-green-700">{logs.filter(l => getStatus(l.value, l.timeType) === '偏高').length} <span className="text-xs">次</span></p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold text-gray-800 flex justify-between items-center">
          <span>历史记录</span>
          <span className="text-[10px] text-gray-400 font-normal">共 {logs.length} 条数据</span>
        </h2>
        {logs.length === 0 ? <p className="text-center py-10 text-gray-300 text-sm italic">暂无数据，请开始记录您的第一笔血糖数值</p> : (
          logs.map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-pink-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-10 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-400' : 'bg-rose-400'}`} />
                <div>
                  <p className="text-sm font-bold text-gray-700">{log.value} <span className="text-[10px] font-normal text-gray-400">mmol/L</span></p>
                  <p className="text-[10px] text-gray-400">
                    <span className="font-bold text-gray-500">{log.timeType === 'fasting' ? '空腹' : '餐后'}</span> • {log.date}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatus(log.value, log.timeType) === '正常' ? 'bg-green-50 text-green-500' : 'bg-rose-50 text-rose-500'}`}>
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
