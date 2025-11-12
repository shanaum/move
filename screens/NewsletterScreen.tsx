import React, { useState, useEffect, useRef } from 'react';
import { CarouselData } from '../types';
import { ChevronLeftIcon, WandSparklesIcon, CopyIcon, DownloadIcon, HashIcon, XIcon } from '../constants';
import { generateHashtags } from '../services/geminiService';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface NewsletterScreenProps {
  onBack: () => void;
  onRegenerate: (post: { title: string; body: string }) => Promise<void>;
  carouselData: CarouselData | null;
  theme: 'dark' | 'light';
}

const LoadingSpinner: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const postToHtml = (data: CarouselData | null, theme: 'dark' | 'light'): string => {
    if (!data || data.length === 0) {
      return `<h1>[Заголовок Рассылки]</h1><p>Начните писать здесь...</p>`;
    }
    const title = data[0].title;
    const bodyHtml = data.map((slide, index) => {
        if (index === 0) {
          return `<p class="leading-relaxed mb-4">${slide.content}</p>`;
        }
        return `<h3 class="text-2xl font-bold mt-6 mb-3 font-bebas tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-800'}">${slide.title}</h3><p class="leading-relaxed mb-4">${slide.content}</p>`;
    }).join('');
    const h1Class = "font-bebas text-4xl sm:text-5xl tracking-wider mb-6 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-transparent bg-clip-text";
    return `<h1 class="${h1Class}">${title}</h1>${bodyHtml}`;
};

const NewsletterScreen: React.FC<NewsletterScreenProps> = ({ onBack, onRegenerate, carouselData, theme }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editedHtml, setEditedHtml] = useState(() => postToHtml(carouselData, theme));
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (carouselData) {
        setEditedHtml(postToHtml(carouselData, theme));
    }
  }, [carouselData, theme]);

  const handleRegenClick = async () => {
    if (!editorRef.current) return;
    setIsRegenerating(true);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorRef.current.innerHTML;

    const titleEl = tempDiv.querySelector('h1');
    const title = titleEl?.innerText || '';
    titleEl?.remove();

    const body = tempDiv.innerText;

    try {
        await onRegenerate({ title, body });
    } catch(e) {
        console.error("Regeneration failed in component", e)
    } finally {
        setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  
  const navButtonClass = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const articleContainerClass = `rounded-2xl p-6 sm:p-8 h-full border ${
      theme === 'dark'
      ? 'backdrop-blur-xl bg-white/5 border-white/10 text-gray-200'
      : 'bg-white border-gray-200 shadow-md text-gray-800'
  }`;
  const actionButtonClasses = `flex-grow flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-bold transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed border ${
      theme === 'dark'
      ? 'backdrop-blur-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
  }`;


  return (
    <div className="w-full h-full flex flex-col max-w-2xl mx-auto p-4 pb-6 sm:p-6 animate-fade-in">
    <header className="flex-shrink-0 w-full z-10 flex justify-between items-center relative">
        <button onClick={onBack} className={`flex items-center gap-1 transition-colors p-2 -ml-2 ${navButtonClass}`}>
            <ChevronLeftIcon className="w-6 h-6"/>
            <span className="font-semibold text-sm">Назад</span>
        </button>
        <div style={{ perspective: '800px' }} className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-bebas text-2xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h1>
        </div>
    </header>
    
    <main className="flex-grow overflow-y-auto my-4 -mr-2 sm:-mr-4 pr-2 sm:pr-4 relative custom-scrollbar">
        <article className={articleContainerClass}>
            <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setEditedHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: editedHtml }}
            className="h-full focus:outline-none font-serif text-lg"
            />
        </article>
    </main>

    <footer className="flex-shrink-0 w-full pt-2 flex items-center flex-wrap gap-2 sm:gap-3">
        <button onClick={handleCopy} className={`${actionButtonClasses} ${copied ? '!bg-green-500 !border-green-400 hover:!bg-green-600 text-white' : ''}`}>
            <CopyIcon className="w-5 h-5"/>
            <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
        </button>
        <button onClick={handleRegenClick} disabled={isRegenerating} className={actionButtonClasses}>
            {isRegenerating ? <LoadingSpinner className="text-white" /> : <WandSparklesIcon className="w-5 h-5 text-purple-400"/>}
            {!isRegenerating && <span>Пересобрать в карусель</span>}
        </button>
    </footer>
    </div>
  );
};

export default NewsletterScreen;