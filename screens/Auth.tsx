
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // 注册表单状态
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('28');
  const [lmpDate, setLmpDate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [healthNotes, setHealthNotes] = useState('无');
  
  // 登录状态
  const [loginName, setLoginName] = useState('');
  const [error, setError] = useState('');

  const getUsers = (): User[] => {
    const data = localStorage.getItem('mama_users_list');
    return data ? JSON.parse(data) : [];
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    
    if (users.find(u => u.nickname === nickname)) {
      setError('该昵称已被注册');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nickname,
      age: parseInt(age),
      lastPeriodDate: lmpDate || new Date().toISOString().split('T')[0],
      height: parseFloat(height) || 0,
      weight: parseFloat(weight) || 0,
      healthNotes: healthNotes || '无'
    };

    const newList = [...users, newUser];
    localStorage.setItem('mama_users_list', JSON.stringify(newList));
    localStorage.setItem('mama_user', JSON.stringify(newUser));
    onLogin(newUser);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.nickname === loginName);

    if (user) {
      localStorage.setItem('mama_user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('用户不存在，请先注册');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 drop-shadow-sm">🤰</div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">悦妈助手</h1>
        <p className="text-gray-500 mt-2 text-sm italic">陪伴您的每一个 280 天</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-pink-100/50 border border-white/50 backdrop-blur-sm">
        <div className="flex mb-8 bg-gray-50 p-1 rounded-2xl">
          <button 
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}
          >
            登录
          </button>
          <button 
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'register' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}
          >
            注册
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs rounded-xl text-center font-medium animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">昵称 / 账号</label>
              <input 
                required
                type="text" 
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                placeholder="请输入注册时的昵称"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] transition-all"
            >
              立即进入
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">昵称</label>
                <input required type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200" placeholder="怎么称呼您？"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">年龄</label>
                <input required type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">末次月经</label>
                <input required type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">身高 (cm)</label>
                <input required type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200" placeholder="165"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">体重 (kg)</label>
                <input required type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200" placeholder="50.0"/>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">基础健康状况 (血糖/血液/疾病)</label>
                <textarea 
                  value={healthNotes} 
                  onChange={(e) => setHealthNotes(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-2xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-pink-200 h-20"
                  placeholder="如：无，或 妊娠期高血糖等"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] transition-all sticky bottom-0"
            >
              完成注册并进入
            </button>
          </form>
        )}
      </div>
      
      <p className="text-center text-[10px] text-gray-300 mt-8">
        悦妈助手 2.0 • 您的私人健康管家
      </p>
    </div>
  );
};

export default Auth;
