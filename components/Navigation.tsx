
import React from 'react';
import { AppScreen } from '../types';

interface NavProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navigation: React.FC<NavProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: AppScreen.DASHBOARD, label: '首页', icon: '🏠' },
    { id: AppScreen.GLUCOSE, label: '血糖', icon: '🩸' },
    { id: AppScreen.HEALTH, label: '饮食', icon: '🍎' },
    { id: AppScreen.CHECKUPS, label: '报告', icon: '🔬' },
    { id: AppScreen.AI_CHAT, label: '咨询', icon: '💬' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-pink-50 flex justify-around items-center py-3 px-4 shadow-[0_-5px_20px_rgba(255,182,193,0.1)] z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center space-y-1 transition-all ${
            currentScreen === item.id ? 'text-pink-500 scale-110' : 'text-gray-300'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-bold tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
