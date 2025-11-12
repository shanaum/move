import React from 'react';
import { ChevronLeftIcon, ClapperboardIcon } from '../constants';

interface ReelsScreenProps {
  onBack: () => void;
  theme: 'dark' | 'light';
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ onBack, theme }) => {
  const navButtonClass = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const headerClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const paragraphClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="w-full h-full flex flex-col max-w-lg mx-auto p-4 animate-fade-in">
      <header className="flex-shrink-0 w-full z-10 flex justify-between items-center relative">
        <button onClick={onBack} className={`flex items-center gap-1 transition-colors p-2 -ml-2 ${navButtonClass}`}>
          <ChevronLeftIcon className="w-6 h-6"/>
          <span className="font-semibold text-sm">Назад</span>
        </button>
        <div style={{ perspective: '800px' }} className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-bebas text-2xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h1>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <ClapperboardIcon className="w-24 h-24 text-purple-400 mb-6 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]" />
        <h2 className={`font-bebas text-4xl mb-2 ${headerClass}`}>Видеоредактор Reels</h2>
        <p className={`text-lg ${paragraphClass}`}>
          Скоро появится! MOVE постоянно развивается, чтобы предоставить вам лучшие инструменты для создания вирусного контента.
        </p>
      </main>
    </div>
  );
};

export default ReelsScreen;