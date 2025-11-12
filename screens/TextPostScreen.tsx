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

interface TextPostScreenProps {
  onBack: () => void;
  onRegenerate: (post: { title: string; body: string }) => Promise<void>;
  carouselData: CarouselData | null;
  generationTone: string;
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
      return `<h1>Заголовок не найден</h1><p>Контент не был сгенерирован.</p>`;
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

interface HashtagModalProps {
    isOpen: boolean;
    onClose: () => void;
    hashtags: string[];
    isLoading: boolean;
    theme: 'dark' | 'light';
}

const HashtagModal: React.FC<HashtagModalProps> = ({ isOpen, onClose, hashtags, isLoading, theme }) => {
    const [copied, setCopied] = useState(false);
    if (!isOpen) return null;

    const handleCopyHashtags = () => {
        const hashtagText = hashtags.map(h => `#${h}`).join(' ');
        navigator.clipboard.writeText(hashtagText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${
                    theme === 'dark'
                    ? 'backdrop-blur-xl bg-white/5 border-white/10'
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bebas text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Рекомендованные хештеги</h3>
                    <button onClick={onClose} className={`p-2 -m-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}><XIcon className="w-6 h-6"/></button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <LoadingSpinner className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}/>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {hashtags.map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded-full">#{tag}</span>
                            ))}
                        </div>
                        <button 
                            onClick={handleCopyHashtags} 
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white transition-colors duration-200 bg-purple-500 rounded-xl hover:bg-purple-600 disabled:opacity-50"
                        >
                            <CopyIcon className="w-5 h-5"/>
                            {copied ? 'Скопировано!' : 'Копировать хештеги'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const TextPostScreen: React.FC<TextPostScreenProps> = ({ onBack, onRegenerate, carouselData, theme }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editedHtml, setEditedHtml] = useState(() => postToHtml(carouselData, theme));
  const [isHashtagModalOpen, setIsHashtagModalOpen] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
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

  const handleGenerateHashtags = async () => {
    if (!editorRef.current || isGeneratingHashtags) return;
    setIsHashtagModalOpen(true);
    setIsGeneratingHashtags(true);
    setHashtags([]);
    try {
        const postText = editorRef.current.innerText;
        const generatedHashtags = await generateHashtags(postText);
        setHashtags(generatedHashtags);
    } catch (e) {
        console.error("Hashtag generation failed", e);
        setHashtags(["ошибка"]);
    } finally {
        setIsGeneratingHashtags(false);
    }
  };
  
  const handleExportPdf = async () => {
    if (!editorRef.current || isExportingPdf) return;
    setIsExportingPdf(true);

    try {
        const { jsPDF } = window.jspdf;
        const contentNode = editorRef.current.cloneNode(true) as HTMLElement;
        
        const pdfContainer = document.createElement('div');
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px';
        pdfContainer.style.width = '210mm';
        pdfContainer.style.padding = '20mm';
        pdfContainer.style.backgroundColor = '#000000';
        pdfContainer.style.color = '#FFFFFF';
        pdfContainer.style.fontFamily = 'Inter, sans-serif';
        
        const logo = document.createElement('div');
        logo.innerHTML = `<h3 class="font-bebas" style="font-family: 'Bebas Neue', sans-serif; font-size: 24pt; letter-spacing: 0.2em; text-align: center; margin-bottom: 20mm; color: #FFFFFF; opacity: 0.7;">MOVE</h3>`;
        
        const h1 = contentNode.querySelector('h1');
        if (h1) {
            h1.style.fontSize = '28pt';
            h1.style.fontFamily = "'Bebas Neue', sans-serif";
            h1.style.marginBottom = '12mm';
            h1.style.background = 'linear-gradient(to right, #f472b6, #a855f7)';
            h1.style.webkitBackgroundClip = 'text';
            h1.style.color = 'transparent';
        }

        contentNode.querySelectorAll('h3').forEach((h: any) => { 
            h.style.fontSize = '16pt'; 
            h.style.fontFamily = "'Bebas Neue', sans-serif";
            h.style.color = '#FFFFFF';
        });

        contentNode.querySelectorAll('p').forEach((p: any) => { 
            p.style.fontSize = '11pt'; 
            p.style.lineHeight = '1.6';
            p.style.color = '#E5E7EB';
        });
        
        pdfContainer.appendChild(logo);
        pdfContainer.appendChild(contentNode);
        document.body.appendChild(pdfContainer);

        const canvas = await window.html2canvas(pdfContainer, { scale: 2, backgroundColor: '#000000' });
        
        document.body.removeChild(pdfContainer);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.save('move-post.pdf');

    } catch (error) {
        console.error("Error exporting to PDF:", error);
    } finally {
        setIsExportingPdf(false);
    }
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
    <>
        <div className="w-full h-full flex flex-col max-w-2xl mx-auto p-4 pb-6 sm:p-6 animate-fade-in">
        <header className="flex-shrink-0 w-full z-10 flex justify-between items-center relative">
            <button onClick={onBack} className={`flex items-center gap-1 transition-colors p-2 -ml-2 ${navButtonClass}`}>
                <ChevronLeftIcon className="w-6 h-6"/>
                <span className="font-semibold text-sm">Назад</span>
            </button>
            <div style={{ perspective: '800px' }} className="absolute left-1/2 -translate-x-1/2">
                <h1 className="font-bebas text-2xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h1>
            </div>
            <button onClick={handleExportPdf} disabled={isExportingPdf} className={`p-2 rounded-lg disabled:opacity-50 ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-black/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} title="Скачать PDF">
                {isExportingPdf ? <LoadingSpinner className="w-5 h-5 text-white" /> : <DownloadIcon className="w-5 h-5"/>}
            </button>
        </header>
        
        <main className="flex-grow overflow-y-auto my-4 -mr-2 sm:-mr-4 pr-2 sm:pr-4 relative custom-scrollbar">
            <article className={articleContainerClass}>
                <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setEditedHtml(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editedHtml }}
                className="h-full focus:outline-none font-merriweather text-lg"
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
                {!isRegenerating && <span>Изменить</span>}
            </button>
            <button onClick={handleGenerateHashtags} disabled={isGeneratingHashtags} className={actionButtonClasses}>
                <HashIcon className="w-5 h-5 text-purple-400"/>
                <span>Хештеги</span>
            </button>
        </footer>
        </div>

        <HashtagModal 
            isOpen={isHashtagModalOpen}
            onClose={() => setIsHashtagModalOpen(false)}
            hashtags={hashtags}
            isLoading={isGeneratingHashtags}
            theme={theme}
        />
    </>
  );
};

export default TextPostScreen;