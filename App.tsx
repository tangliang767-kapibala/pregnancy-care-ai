
import React, { useState, useEffect } from 'react';
import { AppScreen, PregnancyData } from './types';
import Dashboard from './screens/Dashboard';
import Health from './screens/Health';
import Checkups from './screens/Checkups';
import Journal from './screens/Journal';
import Chat from './screens/Chat';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  // Static initial data for prototype
  // In a real app, this would be fetched from storage/API
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    lastPeriodDate: '2024-10-01',
    dueDate: '2025-07-08',
    currentWeek: 24, // Assuming a mock week for display
    daysRemaining: 112,
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard data={pregnancyData} />;
      case AppScreen.HEALTH:
        return <Health />;
      case AppScreen.CHECKUPS:
        return <Checkups />;
      case AppScreen.JOURNAL:
        return <Journal />;
      case AppScreen.AI_CHAT:
        return <Chat currentWeek={pregnancyData.currentWeek} />;
      default:
        return <Dashboard data={pregnancyData} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fef2f2] relative overflow-x-hidden pb-16">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </div>
  );
};

export default App;
