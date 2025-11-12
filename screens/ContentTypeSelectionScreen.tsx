import React from 'react';
import { CarouselData } from '../types';
import {
  ChevronLeftIcon,
  LayoutTemplateIcon,
  FileTextIcon,
  BookOpenIcon,
  ClapperboardIcon,
  MailIcon,
  ThreadsIcon,
  ArrowRightIcon,
} from '../constants';

interface ContentTypeSelectionScreenProps {
  onSelect: (type: string) => void;
  onBack: () => void;
  carouselData: CarouselData | null;
  theme: 'dark' | 'light';
}

const CONTENT_TYPES = [
  {
    key: 'carousel',
    icon: <LayoutTemplateIcon className="w-6 h-6 text-purple-400" />,
    title: 'Карусель',
    description: 'Instagram, LinkedIn, Facebook'
  },
  {
    key: 'stories',
    icon: <BookOpenIcon className="w-6 h-6 text-purple-400" />,
    title: 'Stories',
    description: 'Instagram, Facebook, TikTok'
  },
  {
    key: 'post',
    icon: <FileTextIcon className="w-6 h-6 text-purple-400" />,
    title: 'Пост',
    description: 'Telegram, LinkedIn, блог'
  },
  {
    key: 'threads',
    icon: <ThreadsIcon className="w-6 h-6 text-gray-400" />,
    title: 'Threads',
    description: 'Короткие посты, обсуждения'
  },
  {
    key: 'reels',
    icon: <ClapperboardIcon className="w-6 h-6 text-green-400" />,
    title: 'Reels',
    description: 'Reels, TikTok, Shorts'
  },
  {
    key: 'newsletter',
    icon: <MailIcon className="w-6 h-6 text-yellow-400" />,
    title: 'Newsletter',
    description: 'Email рассылка'
  },
];

const ContentTypeSelectionScreen: React.FC<ContentTypeSelectionScreenProps> = ({ onSelect, onBack, carouselData, theme }) => {
  const ideaTitle = carouselData && carouselData.length > 0 ? carouselData[0].title : "Ваша идея";

  const navButtonClass = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const headerClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const paragraphClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const cardContainerClass = `inline-block text-left max-w-md mx-auto p-4 rounded-xl border ${
      theme === 'dark' 
      ? 'backdrop-blur-xl bg-white/5 border-white/10' 
      : 'bg-white border-gray-200 shadow-sm'
  }`;
  const cardButtonClass = `w-full flex items-center text-left rounded-xl p-4 transition-all duration-200 group border ${
      theme === 'dark'
      ? 'backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
  }`;
  const cardIconContainerClass = `mr-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`;
  
  return (
    <div className="w-full h-full flex flex-col max-w-lg mx-auto p-4 animate-fade-in">
      <header className="flex-shrink-0">
        <button onClick={onBack} className={`flex items-center gap-1 transition-colors p-2 -ml-2 ${navButtonClass}`}>
          <ChevronLeftIcon className="w-6 h-6"/>
          <span className="font-semibold text-sm">Назад</span>
        </button>
      </header>
      
      <main className="flex-grow w-full flex flex-col justify-center overflow-y-auto py-4 custom-scrollbar">
        <div className="w-full text-center mb-8">
          <h1 className={`font-bebas text-5xl sm:text-6xl tracking-widest mb-4 ${headerClass}`}>Контент готов!</h1>
          <div className={cardContainerClass}>
              <p className="text-sm font-bold uppercase tracking-wider text-purple-400">Ваша идея:</p>
              <p className={`text-lg font-semibold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>«{ideaTitle}»</p>
          </div>
        </div>

        <div className="w-full text-center">
            <p className={`text-md mb-6 ${paragraphClass}`}>Теперь выберите, во что его превратить:</p>
        </div>

        <div className="space-y-3">
          {CONTENT_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => onSelect(type.key)}
              className={cardButtonClass}
            >
              <div className={cardIconContainerClass}>{type.icon}</div>
              <div className="flex-grow">
                <h3 className={`font-bold text-lg ${headerClass}`}>{type.title}</h3>
                <p className={`text-sm ${paragraphClass}`}>{type.description}</p>
              </div>
              <ArrowRightIcon className="w-6 h-6 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ContentTypeSelectionScreen;