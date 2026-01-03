
import React, { useState } from 'react';

const Health: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eat' | 'avoid'>('eat');

  const foodsToEat = [
    { name: '深色绿叶蔬菜', desc: '富含叶酸、钙和维生素K', icon: '🥬' },
    { name: '全谷物类', desc: '提供持久能量和膳食纤维', icon: '🍞' },
    { name: '鱼蛋肉类', desc: '优质蛋白质来源', icon: '🥩' },
    { name: '豆奶制品', desc: '补钙关键，助力骨骼发育', icon: '🥛' },
    { name: '新鲜水果', desc: '维生素和天然抗氧化剂', icon: '🍓' },
  ];

  const foodsToAvoid = [
    { name: '生食类', desc: '生鱼片、半熟蛋可能携带细菌', icon: '🍣' },
    { name: '酒精饮料', desc: '影响神经系统发育', icon: '🍷' },
    { name: '过量咖啡因', desc: '建议每天摄入小于200mg', icon: '☕' },
    { name: '高糖高油', desc: '容易引起妊娠期并发症', icon: '🍩' },
    { name: '未经消毒的奶制品', desc: '可能含有李斯特菌', icon: '🧀' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">孕期营养专家</h1>
      
      <div className="flex bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('eat')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'eat' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          ✅ 建议多吃
        </button>
        <button
          onClick={() => setActiveTab('avoid')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'avoid' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          ❌ 尽量避免
        </button>
      </div>

      <div className="grid gap-4">
        {(activeTab === 'eat' ? foodsToEat : foodsToAvoid).map((food, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl flex items-center space-x-4 border border-gray-50 shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full text-2xl">
              {food.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{food.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{food.desc}</p>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${
              activeTab === 'eat' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {activeTab === 'eat' ? '推荐' : '注意'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-2xl">
        <h4 className="font-bold text-blue-800 text-sm flex items-center">
          <span className="mr-2">💧</span> 每日补水建议
        </h4>
        <p className="text-xs text-blue-600 mt-2 leading-relaxed">
          孕期建议每日饮水量约 1.5 - 2.0 升。保持身体水分充盈有助于羊水生成及减少孕期便秘与水肿。
        </p>
      </div>

      <div className="h-20" />
    </div>
  );
};

export default Health;
