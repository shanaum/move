import React, { useState } from 'react';
import { generateCarouselContent } from '../services/geminiService';
import { CarouselData } from '../types';
import GradientButton from '../components/GradientButton';
import { WandSparklesIcon, ChevronLeftIcon, MicIcon, UploadIcon } from '../constants';

interface AiGenerationScreenProps {
  onContentGenerated: (data: CarouselData, tone: string) => void;
  onBack: () => void;
  initialIdea?: string;
  theme: 'dark' | 'light';
}

const TONES = [
  { key: 'daring', label: 'Дерзкий' },
  { key: 'professional', label: 'Деловой' },
  { key: 'provocative', label: 'Провокационный' },
  { key: 'inspirational', label: 'Вдохновляющий' },
  { key: 'witty', label: 'Остроумный' },
  { key: 'minimalistic', label: 'Минималистичный' },
  { key: 'empathetic', label: 'Эмпатичный' },
  { key: 'energetic', label: 'Энергичный' },
];

interface TonePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    tones: typeof TONES;
    selectedTone: string;
    onSelectTone: (tone: string) => void;
    theme: 'dark' | 'light';
}

const TonePickerModal: React.FC<TonePickerModalProps> = ({ isOpen, onClose, tones, selectedTone, onSelectTone, theme }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tone-picker-title"
        >
            <div 
                className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl border ${
                    theme === 'dark' 
                    ? 'backdrop-blur-xl bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="tone-picker-title" className={`font-bebas text-3xl text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите тон</h3>
                <div className="grid grid-cols-2 gap-3">
                    {tones.map(tone => (
                        <button
                            key={tone.key}
                            onClick={() => {
                                onSelectTone(tone.key);
                                onClose();
                            }}
                            className={`w-full px-2 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
                                selectedTone === tone.key 
                                ? 'bg-purple-500 text-white shadow-lg' 
                                : `${theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                            }`}
                        >
                            {tone.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AiGenerationScreen: React.FC<AiGenerationScreenProps> = ({ onContentGenerated, onBack, initialIdea, theme }) => {
    const [idea, setIdea] = useState(initialIdea || '');
    const [loadingStage, setLoadingStage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [selectedTone, setSelectedTone] = useState<string>(TONES[0].key);
    const [isTonePickerOpen, setIsTonePickerOpen] = useState(false);

    const handleGenerate = async () => {
        if (!idea.trim() || loadingStage) return;

        setLoadingStage('analyzing');
        setProgress(0);
        setError(null);

        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 2, 95));
        }, 150);

        const stage2Timer = setTimeout(() => setLoadingStage('generating'), 2500);
        const stage3Timer = setTimeout(() => setLoadingStage('designing'), 5500);

        try {
            const data = await generateCarouselContent(idea, selectedTone);
            clearInterval(progressInterval);
            clearTimeout(stage2Timer);
            clearTimeout(stage3Timer);
            setProgress(100);
            setTimeout(() => {
                onContentGenerated(data, selectedTone);
                // The component will unmount, but for safety:
                setLoadingStage(null);
                setProgress(0);
            }, 500); // Show 100% for a moment
        } catch (err) {
            clearInterval(progressInterval);
            clearTimeout(stage2Timer);
            clearTimeout(stage3Timer);
            console.error(err);
            setError('Не удалось сгенерировать контент. Пожалуйста, попробуйте еще раз.');
            setLoadingStage(null);
            setProgress(0);
        }
    };
    
    const selectedToneLabel = TONES.find(t => t.key === selectedTone)?.label || '';

    const navButtonClass = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
    const headerClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const paragraphClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const textareaContainerClass = `w-full p-2 flex flex-col focus-within:ring-2 focus-within:ring-purple-500 transition-shadow rounded-2xl border ${
        theme === 'dark' 
        ? 'backdrop-blur-xl bg-white/5 border-white/10' 
        : 'bg-white border-gray-200 shadow-sm'
    }`;
    const textareaClass = `w-full h-32 bg-transparent placeholder-gray-500 resize-none focus:outline-none p-2 text-base ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`;
    const toneButtonClass = `p-2 rounded-lg transition-colors disabled:opacity-50 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`;

    return (
        <>
            <div className="w-full h-full flex flex-col max-w-lg mx-auto p-4 animate-fade-in">
                 <header className="absolute top-0 left-0 right-0 py-4 px-4 max-w-lg mx-auto flex items-center z-10">
                    <button onClick={onBack} className={`flex items-center gap-1 transition-colors p-2 -ml-2 ${navButtonClass}`}>
                        <ChevronLeftIcon className="w-6 h-6"/>
                        <span className="font-semibold text-sm">Назад</span>
                    </button>
                    <div style={{ perspective: '800px' }} className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="font-bebas text-2xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h1>
                    </div>
                </header>
                <div className="w-full h-full flex flex-col justify-center">
                    <div className="w-full">
                        <div className="text-center">
                            <WandSparklesIcon className="w-12 h-12 mb-4 text-purple-400 mx-auto drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"/>
                            <h1 className={`font-bebas text-5xl tracking-widest mb-2 ${headerClass}`}>Сначала — идея.</h1>
                            <p className={`text-lg mb-6 ${paragraphClass}`}>Опишите вашу мысль, новость или инсайт. MOVE превратит это в вирусный пост-карусель.</p>
                        </div>
                        
                        <div className={textareaContainerClass}>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Например: 'Запуск нового AI-инструмента...'"
                                className={textareaClass}
                                disabled={!!loadingStage}
                            />
                             <div className="flex items-center justify-end gap-1 px-2">
                                <button className="p-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50" disabled={!!loadingStage} aria-label="Голосовой ввод">
                                    <MicIcon className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50" disabled={!!loadingStage} aria-label="Прикрепить файл">
                                    <UploadIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="w-full my-6 text-center">
                            <button 
                                onClick={() => setIsTonePickerOpen(true)} 
                                disabled={!!loadingStage}
                                className={`text-base ${toneButtonClass}`}
                            >
                                <span className={`font-semibold uppercase tracking-wider text-xs ${paragraphClass}`}>Тон:</span>{' '}
                                <span className="font-bold text-purple-400 border-b-2 border-purple-400/50">
                                    {selectedToneLabel}
                                </span>
                            </button>
                        </div>
                        
                        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

                        <div className="mt-6 w-full min-h-[64px] flex items-center justify-center">
                            {loadingStage ? (
                                <div className="w-full max-w-xs mx-auto text-center">
                                    <span className={`font-semibold text-sm animate-fade-in ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {loadingStage === 'analyzing' && '🔍 Анализирую идею...'}
                                        {loadingStage === 'generating' && '✨ Создаю контент...'}
                                        {loadingStage === 'designing' && '🎨 Оформляю слайды...'}
                                    </span>
                                    <div className="w-full bg-gray-200/20 rounded-full h-1.5 mt-2">
                                        <div 
                                            className="bg-gradient-to-r from-purple-500 to-violet-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <GradientButton onClick={handleGenerate} disabled={!idea.trim()} className="w-full justify-center text-lg !py-4">
                                    {'Сгенерировать'}
                                    <WandSparklesIcon className="w-6 h-6 ml-2"/>
                                </GradientButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TonePickerModal 
                isOpen={isTonePickerOpen}
                onClose={() => setIsTonePickerOpen(false)}
                tones={TONES}
                selectedTone={selectedTone}
                onSelectTone={setSelectedTone}
                theme={theme}
            />
        </>
    );
};

export default AiGenerationScreen;