
import React from 'react';
import { AppScreen } from '../types';

interface NavProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navigation: React.FC<NavProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: AppScreen.DASHBOARD, label: '首页', icon: '🏠' },
    { id: AppScreen.HEALTH, label: '饮食', icon: '🍎' },
    { id: AppScreen.CHECKUPS, label: '产检', icon: '📅' },
    { id: AppScreen.JOURNAL, label: '记录', icon: '✍️' },
    { id: AppScreen.AI_CHAT, label: '咨询', icon: '💬' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 flex justify-around items-center py-2 px-4 shadow-lg pb-safe">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentScreen === item.id ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
