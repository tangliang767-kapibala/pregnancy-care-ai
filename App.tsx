
import React, { useState, useEffect } from 'react';
import { AppScreen, User } from './types';
import Dashboard from './screens/Dashboard';
import Health from './screens/Health';
import Checkups from './screens/Checkups';
import Journal from './screens/Journal';
import Chat from './screens/Chat';
import Auth from './screens/Auth';
import Glucose from './screens/Glucose';
import Navigation from './components/Navigation';
import { calculatePregnancyData } from './utils/pregnancyUtils';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('mama_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  const pregData = calculatePregnancyData(user.lastPeriodDate);

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard user={user} setScreen={setCurrentScreen} />;
      case AppScreen.HEALTH:
        return <Health />;
      case AppScreen.CHECKUPS:
        return <Checkups user={user} />;
      case AppScreen.JOURNAL:
        return <Journal />;
      case AppScreen.AI_CHAT:
        return <Chat user={user} currentWeek={pregData.currentWeek} />;
      case AppScreen.GLUCOSE:
        return <Glucose />;
      default:
        return <Dashboard user={user} setScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fef2f2] relative overflow-x-hidden pb-16 shadow-2xl">
      <div className="min-h-screen pb-20">
        {renderScreen()}
      </div>
      <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </div>
  );
};

export default App;
