import React from 'react';
import { HomeIcon, LayersIcon, WandSparklesIcon, SettingsIcon } from '../constants';
import { Screen } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  theme: 'dark' | 'light';
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, theme }) => (
  <button onClick={onClick} className={`relative flex flex-col items-center justify-center space-y-1 w-20 transition-colors group ${active ? (theme === 'dark' ? 'text-white' : 'text-purple-600') : (theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}>
    <div className="w-6 h-6">{icon}</div>
    <span className="text-xs font-bold">{label}</span>
    {active && (
      <div className="absolute -bottom-2 w-10 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
    )}
  </button>
);


interface BottomNavBarProps {
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
    theme: 'dark' | 'light';
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, onNavigate, theme }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 p-3">
          <div className={`flex justify-around items-center max-w-sm mx-auto rounded-2xl p-1 h-16 shadow-2xl ${
              theme === 'dark' 
              ? 'backdrop-blur-xl bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-purple-900/80 border-t border-white/20 shadow-black/50'
              : 'bg-white border-t border-gray-200 shadow-lg'
          }`}>
            <NavItem icon={<HomeIcon />} label="Главная" active={activeScreen === Screen.Dashboard} onClick={() => onNavigate(Screen.Dashboard)} theme={theme} />
            <NavItem icon={<LayersIcon />} label="Проекты" active={activeScreen === Screen.Projects} onClick={() => onNavigate(Screen.Projects)} theme={theme} />
            <NavItem icon={<SettingsIcon />} label="Настройки" active={activeScreen === Screen.Settings} onClick={() => onNavigate(Screen.Settings)} theme={theme} />
          </div>
        </footer>
    );
};

export default BottomNavBar;