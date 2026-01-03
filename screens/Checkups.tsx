
import React, { useState } from 'react';
import { INITIAL_CHECKUPS } from '../constants';

const Checkups: React.FC = () => {
  const [checkups, setCheckups] = useState(INITIAL_CHECKUPS);

  const toggleCheckup = (id: string) => {
    setCheckups(prev => prev.map(c => 
      c.id === id ? { ...c, isCompleted: !c.isCompleted } : c
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">产检时间轴</h1>
      
      <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-pink-100">
        {checkups.map((item) => (
          <div key={item.id} className="relative flex items-start pl-12">
            {/* Timeline dot */}
            <button 
              onClick={() => toggleCheckup(item.id)}
              className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
                item.isCompleted ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-300'
              }`}
            >
              {item.isCompleted ? '✓' : item.week}
            </button>

            <div className={`flex-1 p-4 rounded-2xl border ${
              item.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-pink-50 shadow-sm'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {item.title}
                </h3>
                <span className="text-[10px] bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full font-bold">
                  W{item.week}
                </span>
              </div>
              <p className={`text-xs ${item.isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-20" />
    </div>
  );
};

export default Checkups;
