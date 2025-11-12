import React from 'react';
import GradientButton from '../components/GradientButton';
import { ArrowRightIcon } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  theme: 'dark' | 'light';
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, theme }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full w-full max-w-lg mx-auto p-8 animate-fade-in">
      
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h1 className={`font-bebas text-6xl sm:text-7xl md:text-8xl tracking-wider leading-none mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          MOVE создает <br/> новый 
          <span className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-transparent bg-clip-text">
             тренд
          </span>
        </h1>
        <p className={`text-lg max-w-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          От мысли до идеального поста — одна минута. Пока конкуренты думают, ты уже публикуешь.
        </p>
      </div>
      
      <div className="flex-shrink-0 w-full flex flex-col items-center pb-8">
        <GradientButton onClick={onStart} icon={<ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />} className="text-lg">
          Начать
        </GradientButton>
      </div>

    </div>
  );
};

export default WelcomeScreen;