import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  TypeIcon,
  DownloadIcon, XIcon,
  ChevronLeftIcon as BackIcon,
  PlusIcon, Trash2Icon,
  Share2Icon,
  PaintBucketIcon, LayoutTemplateIcon, AlignLeftIcon, AlignCenterHorizontalIcon, AlignRightIcon,
  RepeatIcon, GemIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon, AlignVerticalJustifyStartIcon, AlignVerticalJustifyCenterIcon, AlignVerticalJustifyEndIcon, WandSparklesIcon, BoldIcon, ItalicIcon,
  FileTextIcon, BookOpenIcon, ClapperboardIcon, MailIcon, ThreadsIcon, ImageIcon
} from '../constants';
import { CarouselData, SlideData, Screen, ContentType } from '../types';
import { FONTS } from '../constants';

// For html2canvas, jspdf, and jszip from CDN
declare global {
  const html2canvas: any;
  const jspdf: any;
  const JSZip: any;
}

interface EditorScreenProps {
  onBack: () => void;
  carouselData: CarouselData | null;
  onNavigate: (screen: Screen) => void;
  contentType: ContentType;
  theme: 'dark' | 'light';
}

interface EditableSlideData extends SlideData {
  id: string;
  backgroundId: number;
  titleFontClass: string;
  contentFontClass: string;
  backgroundImage?: string | null;
  titleAlign: 'text-left' | 'text-center' | 'text-right';
  contentAlign: 'text-left' | 'text-center' | 'text-right';
  vAlign: 'justify-start' | 'justify-center' | 'justify-end';
  customBackgroundColor?: string;
  highlightColor: string;
  // New text style properties
  titleFontSize: number;
  contentFontSize: number;
  titleColor: string;
  contentColor: string;
  isTitleBold: boolean;
  isTitleItalic: boolean;
  isContentBold: boolean;
  isContentItalic: boolean;
  contentLineHeight: number;
}

type ActivePanel = 'TEMPLATE' | 'BACKGROUND' | 'TEXT' | 'BRAND' | null;

const BACKGROUNDS = [
    { id: 0, name: 'AI Image', style: {}, thumbStyle: { background: 'linear-gradient(45deg, #ec4899, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: 11, name: 'Forest Green', style: { backgroundColor: '#1A2E28', backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232E4B40' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }, thumbStyle: { backgroundColor: '#1A2E28' } },
    { id: 1, name: 'Dark Noise', style: { backgroundColor: '#1a1a1a', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23404040' stroke-width='1'%3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 125c0 0 125-30 250-30S0 125 0 125s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 175c0 0 125-30 250-30S0 175 0 175s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 225c0 0 125-30 250-30S0 225 0 225s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 275c0 0 125-30 250-30S0 275 0 275s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 325c0 0 125-30 250-30S0 325 0 325s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 375c0 0 125-30 250-30S0 375 0 375s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 425c0 0 125-30 250-30S0 425 0 425s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 475c0 0 125-30 250-30S0 475 0 475s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 525c0 0 125-30 250-30S0 525 0 525s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 575c0 0 125-30 250-30S0 575 0 575s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 625c0 0 125-30 250-30S0 625 0 625s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`, opacity: 0.2 }, thumbStyle: { backgroundColor: '#1a1a1a' } },
];

const GRADIENTS = [
    { name: 'Sunset', style: { background: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #facc15 100%)' } },
    { name: 'Ocean', style: { background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' } },
    { name: 'Grape', style: { background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)' } },
    { name: 'Lime', style: { background: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)' } },
    { name: 'Rose', style: { background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' } },
    { name: 'Noir', style: { background: 'linear-gradient(135deg, #404040 0%, #171717 100%)' } },
];

type TemplateDefinition = Partial<Omit<EditableSlideData, 'id' | 'title' | 'content' | 'highlight_keywords' | 'image_prompt'>>;
const TEMPLATES: (TemplateDefinition & { name: string })[] = [
    { name: 'Стандарт', backgroundId: 11, titleFontClass: 'font-bebas', contentFontClass: 'font-inter', vAlign: 'justify-center', titleAlign: 'text-left', contentAlign: 'text-left', highlightColor: '#dfff00' },
    { name: 'Минимал', customBackgroundColor: '#f3f4f6', titleFontClass: 'font-inter', contentFontClass: 'font-inter', vAlign: 'justify-center', titleAlign: 'text-center', contentAlign: 'text-center', highlightColor: '#d1d5db' },
    { name: 'Брутал', customBackgroundColor: '#000000', titleFontClass: 'font-source-code-pro', contentFontClass: 'font-source-code-pro', vAlign: 'justify-start', titleAlign: 'text-left', contentAlign: 'text-left', highlightColor: '#fef08a' },
    { name: 'Градиент', customBackgroundColor: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)', titleFontClass: 'font-bebas', contentFontClass: 'font-raleway', vAlign: 'justify-end', titleAlign: 'text-right', contentAlign: 'text-right', highlightColor: '#a5b4fc' },
];

// Fix: Removed incorrect type annotation to allow TypeScript to infer non-optional properties.
const DEFAULT_TEXT_STYLES = {
  titleFontClass: 'font-bebas',
  contentFontClass: 'font-inter',
  titleFontSize: 48,
  contentFontSize: 18,
  titleColor: '',
  contentColor: '',
  isTitleBold: true,
  isTitleItalic: false,
  isContentBold: false,
  isContentItalic: false,
  contentLineHeight: 1.6,
};

function isColorLight(hexColor: string | null | undefined): boolean {
  if (!hexColor || hexColor.includes('gradient')) return false;
  const color = (hexColor.charAt(0) === '#') ? hexColor.substring(1, 7) : hexColor;
  if (color.length < 6) return false;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179);
}

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean; tooltip?: string, vertical?: boolean, label?: string, theme: 'dark' | 'light' }> = ({ children, className, isActive, tooltip, vertical, label, theme, ...props }) => (
  <button
    className={`relative group flex ${vertical ? 'flex-col items-center justify-center gap-1 w-20' : 'items-center'} p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${isActive ? 'bg-purple-600 text-white' : `${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`} ${className}`}
    {...props}
  >
    {children}
    {label && <span className="text-xs font-semibold">{label}</span>}
    {tooltip && <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {tooltip}
    </div>}
  </button>
);

const BackgroundRenderer: React.FC<{ slide: EditableSlideData }> = ({ slide }) => {
    const { backgroundId, image_prompt, backgroundImage, customBackgroundColor } = slide;

    if (customBackgroundColor) {
        return <div className="absolute inset-0 z-0" style={{ background: customBackgroundColor }}></div>;
    }
    
    // Prioritize custom uploaded background image
    if (backgroundImage) {
        return (
            <>
                <img src={backgroundImage} alt="background" className="absolute inset-0 w-full h-full object-cover z-0" style={{ filter: 'brightness(0.5)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            </>
        );
    }

    const selectedBg = BACKGROUNDS.find(bg => bg.id === backgroundId) || BACKGROUNDS[0];

    if (backgroundId === 0) {
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(image_prompt)}/1080/1080`;
        return (
            <>
                <img src={imageUrl} alt="background" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
            </>
        );
    }

    return <div className="absolute inset-0 z-0" style={selectedBg.style}></div>;
};

const HighlightedContent: React.FC<{ text: string; keywords: string[]; color: string }> = ({ text, keywords, color }) => {
    if (!keywords || keywords.length === 0) return <>{text}</>;

    const regex = new RegExp(`(${keywords.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          keywords.some(keyword => new RegExp(`^${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i').test(part)) ? (
            <span key={i} className="relative inline">
              <span className="relative z-10">{part}</span>
              <span
                className="absolute left-[-0.2em] right-[-0.2em] bottom-0 h-[0.4em] z-0 opacity-80"
                style={{ backgroundColor: color }}
              ></span>
            </span>
          ) : (part)
        )}
      </>
    );
};

const CoverComponent: React.FC<{
    slide: EditableSlideData;
    onTextChange: (slideId: string, field: 'title' | 'content', newText: string) => void;
    brandLogo: string | null;
    authorName: string;
    slideNumber: number;
    totalSlides: number;
}> = ({ slide, onTextChange, brandLogo, authorName, slideNumber, totalSlides }) => {
    const { id, title, content, titleFontClass, contentFontClass, vAlign, titleAlign, contentAlign, highlight_keywords, highlightColor,
        titleFontSize, contentFontSize, titleColor, contentColor, isTitleBold, isTitleItalic, isContentBold, isContentItalic, contentLineHeight } = slide;
    
    const isLightBg = isColorLight(slide.customBackgroundColor);
    
    const finalTitleColor = titleColor || (isLightBg ? '#1f2937' : '#ffffff');
    const finalContentColor = contentColor || (isLightBg ? '#374151' : '#e5e7eb');

    const titleStyles: React.CSSProperties = {
        fontSize: `${titleFontSize / 16}rem`,
        color: finalTitleColor,
        fontWeight: isTitleBold ? 'bold' : 'normal',
        fontStyle: isTitleItalic ? 'italic' : 'normal',
    };
    const contentStyles: React.CSSProperties = {
        fontSize: `${contentFontSize / 16}rem`,
        color: finalContentColor,
        fontWeight: isContentBold ? 'bold' : 'normal',
        fontStyle: isContentItalic ? 'italic' : 'normal',
        lineHeight: contentLineHeight,
    };

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    useEffect(() => {
        if (isEditingTitle && titleRef.current) {
            titleRef.current.focus();
            autoResize(titleRef.current);
        }
    }, [isEditingTitle]);

    useEffect(() => {
        if (isEditingContent && contentRef.current) {
            contentRef.current.focus();
            autoResize(contentRef.current);
        }
    }, [isEditingContent]);

    const handleTitleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        onTextChange(id, 'title', e.target.value);
        setIsEditingTitle(false);
    }

    const handleContentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        onTextChange(id, 'content', e.target.value);
        setIsEditingContent(false);
    }

    return (
        <div className="w-full h-full relative overflow-hidden bg-black rounded-3xl shadow-2xl shadow-black/70 flex flex-col p-8">
            <BackgroundRenderer slide={slide} />
            <header className="absolute top-6 left-8 right-8 z-30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {brandLogo ? (
                        <img src={brandLogo} alt="Brand Logo" className="h-6 object-contain"/>
                    ) : (
                        <span className={`font-bold text-sm ${isLightBg ? 'text-gray-600' : 'text-gray-300'}`}>{authorName}</span>
                    )}
                </div>
                <span className={`font-mono text-sm ${isLightBg ? 'text-black/50' : 'text-white/50'}`}>
                    {slideNumber}/{totalSlides}
                </span>
            </header>
            <main className={`relative z-20 w-full flex-grow flex flex-col pt-12 ${vAlign}`}>
                {isEditingTitle ? (
                    <textarea
                        ref={titleRef}
                        defaultValue={title}
                        onBlur={handleTitleBlur}
                        onInput={(e) => autoResize(e.currentTarget)}
                        className={`w-full bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-sm p-1 -m-1 ${titleFontClass} ${titleAlign}`}
                        style={{ ...titleStyles, overflowWrap: 'break-word' }}
                        rows={1}
                    />
                ) : (
                    <h2
                        onClick={() => setIsEditingTitle(true)}
                        className={`p-1 -m-1 cursor-pointer ${titleFontClass} ${titleAlign}`}
                        style={{ ...titleStyles, overflowWrap: 'break-word' }}
                    >
                        {title}
                    </h2>
                )}
                {isEditingContent ? (
                    <textarea
                        ref={contentRef}
                        defaultValue={content}
                        onBlur={handleContentBlur}
                        onInput={(e) => autoResize(e.currentTarget)}
                        className={`w-full mt-4 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-sm p-1 -m-1 ${contentFontClass} ${contentAlign}`}
                        style={{...contentStyles, overflowWrap: 'break-word' }}
                        rows={2}
                    />
                ) : (
                    <div
                        onClick={() => setIsEditingContent(true)}
                        className={`mt-4 p-1 -m-1 cursor-pointer ${contentFontClass} ${contentAlign}`}
                        style={{...contentStyles, overflowWrap: 'break-word' }}
                    >
                        <HighlightedContent text={content} keywords={highlight_keywords} color={highlightColor} />
                    </div>
                )}
            </main>
        </div>
    );
};

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; theme: 'dark' | 'light' }> = ({ checked, onChange, label, theme }) => (
    <label className="flex items-center cursor-pointer">
        <span className={`text-sm font-semibold mr-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
            <div className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : (theme === 'dark' ? 'bg-white/20' : 'bg-gray-300')}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);

const LayoutPanelContent: React.FC<{
    onApplyTemplate: (template: TemplateDefinition, applyToAll: boolean) => void;
    onApplyCustomBackground: (image: string, applyToAll: boolean) => void;
    onAddUserImage: (image: string) => void;
    userImages: string[];
    theme: 'dark' | 'light';
}> = ({ onApplyTemplate, onApplyCustomBackground, onAddUserImage, userImages, theme }) => {
    const [applyToAll, setApplyToAll] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const applyToAllRef = useRef(applyToAll);
    useEffect(() => {
        applyToAllRef.current = applyToAll;
    }, [applyToAll]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imageSrc = e.target.result as string;
                    onAddUserImage(imageSrc);
                    onApplyCustomBackground(imageSrc, applyToAllRef.current);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const textHeaderClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const cardBgClass = theme === 'dark' ? 'bg-black/30' : 'bg-gray-100';

    return (
        <div className="px-2">
            <div>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3`}>Свое фото</h4>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center border-2 border-dashed transition-colors ${cardBgClass} ${theme === 'dark' ? 'text-gray-400 hover:text-white border-gray-600 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        aria-label="Загрузить фото"
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                     {userImages.map((img, index) => (
                        <button 
                            key={index} 
                            onClick={() => onApplyCustomBackground(img, applyToAll)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-colors ${cardBgClass}`}
                        >
                            <img src={img} alt={`user upload ${index+1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
                <div className="flex justify-end items-center mt-4 pt-2">
                   <Switch checked={applyToAll} onChange={setApplyToAll} label="Применить ко всем" theme={theme} />
                </div>
            </div>
            <div className={`border-t pt-4 mt-4 ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3`}>Готовые шаблоны</h4>
                <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map(template => (
                        <button key={template.name} onClick={() => onApplyTemplate(template, applyToAll)} className={`aspect-[4/3] rounded-lg p-2 flex flex-col justify-end text-left hover:ring-2 ring-purple-500 transition-all ${cardBgClass}`}>
                            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{template.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BackgroundPanelContent: React.FC<{
    currentSlide: EditableSlideData;
    onUpdate: (updates: Partial<EditableSlideData>) => void;
    theme: 'dark' | 'light';
}> = ({ currentSlide, onUpdate, theme }) => {
    const handleColorBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(newColor)) {
           onUpdate({ backgroundId: -1, customBackgroundColor: newColor, backgroundImage: null });
        }
    };
    const isGradient = currentSlide.customBackgroundColor?.includes('gradient');
    const solidBgColor = isGradient ? '#1f2937' : (currentSlide.customBackgroundColor || '#1f2937');
    
    const textHeaderClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const borderClass = theme === 'dark' ? 'border-white/20' : 'border-gray-200';
    const inputBgClass = theme === 'dark' ? 'bg-black/20' : 'bg-gray-100';

    return (
        <div className="px-2 space-y-4">
            <div>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3`}>Готовые Фоны</h4>
                <div className="flex flex-wrap gap-3 items-center">
                    {BACKGROUNDS.map(bg => (
                        <button key={bg.id} onClick={() => onUpdate({ backgroundId: bg.id, customBackgroundColor: undefined, backgroundImage: null })}
                            className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center ${currentSlide.backgroundId === bg.id && !currentSlide.customBackgroundColor && !currentSlide.backgroundImage ? 'border-purple-500 ring-2 ring-purple-500/50' : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')} hover:border-purple-400`}
                            style={bg.thumbStyle} aria-label={bg.name}>
                            {bg.id === 0 && <WandSparklesIcon className="w-5 h-5 text-white" />}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={`border-t ${borderClass} pt-4`}>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3 text-left`}>Градиенты</h4>
                <div className="flex flex-wrap gap-3 items-center">
                    {GRADIENTS.map(gradient => (
                        <button 
                            key={gradient.name} 
                            onClick={() => onUpdate({ backgroundId: -1, customBackgroundColor: gradient.style.background, backgroundImage: null })}
                            className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${currentSlide.customBackgroundColor === gradient.style.background ? 'border-purple-500 ring-2 ring-purple-500/50' : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')} hover:border-purple-400`}
                            style={gradient.style}
                            aria-label={gradient.name}
                        />
                    ))}
                </div>
            </div>

            <div className={`border-t ${borderClass} pt-4`}>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3 text-left`}>Сплошной Цвет</h4>
                 <div className="flex items-center gap-3">
                    <label className={`relative w-9 h-9 rounded-md border-2 cursor-pointer shadow-md overflow-hidden ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                        <div className="w-full h-full" style={{ background: solidBgColor }} />
                        <input type="color" value={solidBgColor.startsWith('#') ? solidBgColor : '#1f2937'}
                            onChange={e => onUpdate({ backgroundId: -1, customBackgroundColor: e.target.value, backgroundImage: null })}
                            onBlur={handleColorBlur} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                    </label>
                    <input type="text" value={isGradient ? 'Градиент' : (currentSlide.customBackgroundColor || '')}
                        onChange={(e) => { if (/^#[0-9A-F]{0,6}$/i.test(e.target.value)) { onUpdate({ backgroundId: -1, customBackgroundColor: e.target.value, backgroundImage: null }) } }}
                        onBlur={handleColorBlur} placeholder="#1f2937"
                        className={`border rounded-lg py-2 px-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono w-28 ${inputBgClass} ${theme === 'dark' ? 'text-white border-white/20' : 'text-gray-800 border-gray-300'}`}/>
                </div>
            </div>
            <div className={`border-t ${borderClass} pt-4`}>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-3 text-left`}>Цвет Выделения</h4>
                <div className="flex items-center gap-3">
                     <label className={`relative w-9 h-9 rounded-md border-2 cursor-pointer shadow-md overflow-hidden ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                        <div className="w-full h-full" style={{ backgroundColor: currentSlide.highlightColor }} />
                        <input type="color" value={currentSlide.highlightColor} onChange={(e) => onUpdate({ highlightColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                    </label>
                     <input type="text" value={currentSlide.highlightColor}
                        onChange={(e) => { if (/^#[0-9A-F]{0,6}$/i.test(e.target.value)) { onUpdate({ highlightColor: e.target.value }) } }}
                        placeholder="#DFFF00"
                        className={`border rounded-lg py-2 px-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono w-28 ${inputBgClass} ${theme === 'dark' ? 'text-white border-white/20' : 'text-gray-800 border-gray-300'}`}/>
                </div>
            </div>
        </div>
    );
};

const TextPanelContent: React.FC<{
    currentSlide: EditableSlideData;
    onUpdate: (updates: Partial<EditableSlideData>) => void;
    theme: 'dark' | 'light';
}> = ({ currentSlide, onUpdate, theme }) => {
    
    const handleResetStyles = () => {
        onUpdate(DEFAULT_TEXT_STYLES);
    };
    
    const textHeaderClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const borderClass = theme === 'dark' ? 'border-white/20' : 'border-gray-200';
    const selectClass = `w-full border text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-black/30 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`;
    const inputClass = `w-full border text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-black/30 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`;

    return (
        <div className="px-2 space-y-4">
            {/* Title Section */}
            <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass}`}>Заголовок</h4>
                <select value={currentSlide.titleFontClass} onChange={e => onUpdate({ titleFontClass: e.target.value })} className={selectClass}>
                    {FONTS.map(f => <option key={f.class} value={f.class} className={`${f.class} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} style={{ fontFamily: f.name }}>{f.name}</option>)}
                </select>
                 <div className="flex items-center gap-4">
                    <input type="range" min="24" max="96" value={currentSlide.titleFontSize} onChange={e => onUpdate({ titleFontSize: Number(e.target.value) })} className="w-full accent-purple-500" />
                    <span className="text-sm w-10 text-right">{currentSlide.titleFontSize}px</span>
                </div>
                 <div className="flex items-center gap-2">
                    <label className={`w-9 h-9 rounded-lg border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center`} style={{ backgroundColor: currentSlide.titleColor || '#1f2937' }}>
                         <input type="color" value={currentSlide.titleColor || '#ffffff'} onChange={(e) => onUpdate({ titleColor: e.target.value })} className="absolute opacity-0 w-9 h-9 cursor-pointer"/>
                    </label>
                    <div className={`flex items-center rounded-lg p-1 flex-grow ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                         <IconButton theme={theme} className="flex-1 justify-center" isActive={currentSlide.isTitleBold} onClick={() => onUpdate({ isTitleBold: !currentSlide.isTitleBold })}><BoldIcon className="w-5 h-5"/></IconButton>
                         <IconButton theme={theme} className="flex-1 justify-center" isActive={currentSlide.isTitleItalic} onClick={() => onUpdate({ isTitleItalic: !currentSlide.isTitleItalic })}><ItalicIcon className="w-5 h-5"/></IconButton>
                    </div>
                </div>
            </div>
            
            <div className={`border-t ${borderClass} pt-4 space-y-3`}>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass}`}>Основной текст</h4>
                 <select value={currentSlide.contentFontClass} onChange={e => onUpdate({ contentFontClass: e.target.value })} className={selectClass}>
                    {FONTS.map(f => <option key={f.class} value={f.class} className={`${f.class} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} style={{ fontFamily: f.name }}>{f.name}</option>)}
                </select>
                <div className="flex items-center gap-4">
                    <input type="range" min="12" max="48" value={currentSlide.contentFontSize} onChange={e => onUpdate({ contentFontSize: Number(e.target.value) })} className="w-full accent-purple-500" />
                    <span className="text-sm w-10 text-right">{currentSlide.contentFontSize}px</span>
                </div>
                 <div className="flex items-center gap-2">
                     <label className={`w-9 h-9 rounded-lg border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center`} style={{ backgroundColor: currentSlide.contentColor || '#1f2937' }}>
                         <input type="color" value={currentSlide.contentColor || '#ffffff'} onChange={(e) => onUpdate({ contentColor: e.target.value })} className="absolute opacity-0 w-9 h-9 cursor-pointer"/>
                    </label>
                    <div className={`flex items-center rounded-lg p-1 flex-grow ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                         <IconButton theme={theme} className="flex-1 justify-center" isActive={currentSlide.isContentBold} onClick={() => onUpdate({ isContentBold: !currentSlide.isContentBold })}><BoldIcon className="w-5 h-5"/></IconButton>
                         <IconButton theme={theme} className="flex-1 justify-center" isActive={currentSlide.isContentItalic} onClick={() => onUpdate({ isContentItalic: !currentSlide.isContentItalic })}><ItalicIcon className="w-5 h-5"/></IconButton>
                    </div>
                </div>
                 <div>
                    <h5 className={`text-xs font-bold uppercase ${textHeaderClass} mb-1 mt-2`}>Межстрочный интервал</h5>
                    <div className="flex items-center gap-4">
                        <input type="range" min="1" max="2.5" step="0.1" value={currentSlide.contentLineHeight} onChange={e => onUpdate({ contentLineHeight: Number(e.target.value) })} className="w-full accent-purple-500" />
                        <span className="text-sm w-10 text-right">{currentSlide.contentLineHeight.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div className={`border-t ${borderClass} pt-4 space-y-3`}>
                 <h4 className={`text-xs font-bold uppercase ${textHeaderClass}`}>Выделение слов</h4>
                 <input 
                    type="text" 
                    defaultValue={currentSlide.highlight_keywords.join(', ')} 
                    onBlur={e => onUpdate({ highlight_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                    placeholder="ключевое слово, другое слово"
                    className={inputClass}
                />
            </div>
            
            <div className={`border-t ${borderClass} pt-4 mt-4`}>
                <button onClick={handleResetStyles} className={`w-full text-center text-sm font-bold rounded-lg transition-colors py-2.5 ${theme === 'dark' ? 'text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20' : 'text-purple-600 hover:text-purple-800 bg-purple-100 hover:bg-purple-200'}`}>
                    Сбросить стиль
                </button>
            </div>
        </div>
    );
};

const BrandPanelContent: React.FC<{
    brandSettings: { logo: string | null; authorName: string };
    onUpdateBrandSettings: (settings: { logo?: string | null; authorName?: string }) => void;
    theme: 'dark' | 'light';
}> = ({ brandSettings, onUpdateBrandSettings, theme }) => {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onUpdateBrandSettings({ logo: reader.result as string });
            reader.readAsDataURL(file);
        }
    };
    
    const textHeaderClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
    const containerBgClass = theme === 'dark' ? 'bg-black/30 border-white/20' : 'bg-gray-100 border-gray-300';
    const buttonBgClass = theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    
    return (
        <div className="px-2 space-y-4">
            <div>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-2`}>Логотип</h4>
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center border ${containerBgClass}`}>
                        {brandSettings.logo ? <img src={brandSettings.logo} alt="logo" className="max-w-full max-h-full object-contain" /> : <GemIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}/>}
                    </div>
                    <div className="flex-grow">
                        <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                        <button onClick={() => logoInputRef.current?.click()} className={`w-full text-sm font-bold py-2.5 px-4 rounded-lg transition-colors ${buttonBgClass}`}>Загрузить лого</button>
                        {brandSettings.logo && (<button onClick={() => onUpdateBrandSettings({ logo: null })} className="w-full text-center text-xs text-red-400 hover:text-red-300 p-2 mt-1">Удалить</button>)}
                    </div>
                </div>
            </div>
            <div>
                <h4 className={`text-xs font-bold uppercase ${textHeaderClass} mb-2`}>Имя автора</h4>
                <input type="text" value={brandSettings.authorName} onChange={(e) => onUpdateBrandSettings({ authorName: e.target.value })} placeholder="@ваш_аккаунт" className={`w-full border text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 ${containerBgClass} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}/>
            </div>
        </div>
    );
};

const EditingPanel: React.FC<{ activePanel: ActivePanel, onClose: () => void; children?: React.ReactNode; theme: 'dark' | 'light' }> = ({ activePanel, onClose, children, theme }) => {
    const getPanelTitle = (panel: ActivePanel) => ({ TEMPLATE: 'Шаблон', BACKGROUND: 'Фон', TEXT: 'Текст', BRAND: 'Бренд' })[panel!] || '';
    return (
        <div className={`h-96 max-w-lg mx-auto rounded-t-2xl border ${
            theme === 'dark' 
            ? 'backdrop-blur-xl bg-white/5 border-white/10' 
            : 'bg-white border-gray-200 shadow-xl'
        }`}>
            <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <h3 className={`font-bebas text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getPanelTitle(activePanel)}</h3>
                <IconButton onClick={onClose} tooltip="Закрыть" theme={theme}><XIcon className="w-5 h-5" /></IconButton>
            </div>
            <div className={`p-4 overflow-y-auto h-[calc(100%-65px)] custom-scrollbar ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{children}</div>
        </div>
    );
};

const LoadingSpinner: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CONTENT_TYPES_FOR_MODAL = [
  { key: 'carousel', icon: <LayoutTemplateIcon className="w-6 h-6 text-purple-400" />, title: 'Карусель (1:1)', description: 'Instagram, LinkedIn' },
  { key: 'stories', icon: <BookOpenIcon className="w-6 h-6 text-purple-400" />, title: 'Stories (9:16)', description: 'Instagram, TikTok' },
  { key: 'post', icon: <FileTextIcon className="w-6 h-6 text-purple-400" />, title: 'Пост (Текст)', description: 'Telegram, Блог' },
  { key: 'threads', icon: <ThreadsIcon className="w-6 h-6 text-gray-400" />, title: 'Threads', description: 'Короткие посты' },
  { key: 'newsletter', icon: <MailIcon className="w-6 h-6 text-yellow-400" />, title: 'Рассылка', description: 'Длинный формат' },
  { key: 'reels', icon: <ClapperboardIcon className="w-6 h-6 text-green-400" />, title: 'Reels (Видео)', description: 'Скоро' },
];

const FormatConversionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (format: ContentType) => void;
  currentFormat: ContentType;
  theme: 'dark' | 'light';
}> = ({ isOpen, onClose, onSelect, currentFormat, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className={`rounded-2xl p-6 w-full max-w-md border ${theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-bebas text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Конвертировать формат</h3>
          <button onClick={onClose} className={`p-2 -m-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          {CONTENT_TYPES_FOR_MODAL.map(type => (
            <button
              key={type.key}
              onClick={() => onSelect(type.key as ContentType)}
              className={`w-full flex items-center text-left border-2 rounded-xl p-3 transition-all duration-200 group
                ${currentFormat === type.key ? 'border-purple-500' : (theme === 'dark' ? 'border-white/10' : 'border-gray-200')}
                ${theme === 'dark' ? 'bg-black/20 hover:bg-black/30 hover:border-purple-500/50' : 'bg-gray-50 hover:bg-gray-100 hover:border-purple-300'}
                cursor-pointer
              `}
            >
              <div className={`mr-4 p-2.5 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-200'}`}>{type.icon}</div>
              <div className="flex-grow">
                <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{type.title}</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{type.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${currentFormat === type.key ? 'bg-purple-500 border-purple-500' : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')}`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SlidePreview: React.FC<{ slide: EditableSlideData, brandLogo: string | null, authorName: string, slideNumber: number, totalSlides: number }> = ({ slide, brandLogo, authorName, slideNumber, totalSlides }) => {
    // Fix: Add missing `contentAlign` to destructuring.
    const { title, content, titleFontClass, contentFontClass, vAlign, titleAlign, contentAlign, highlight_keywords, highlightColor,
        titleFontSize, contentFontSize, titleColor, contentColor, isTitleBold, isTitleItalic, isContentBold, isContentItalic, contentLineHeight } = slide;
    
    const isLightBg = isColorLight(slide.customBackgroundColor);
    const finalTitleColor = titleColor || (isLightBg ? '#1f2937' : '#ffffff');
    const finalContentColor = contentColor || (isLightBg ? '#374151' : '#e5e7eb');

    const scaleFactor = 4; // How much smaller the preview is than the export version.

    return (
        <div className="w-full h-full relative overflow-hidden bg-black rounded-lg shadow-lg flex flex-col p-[8%]">
            <BackgroundRenderer slide={slide} />
            <header className="absolute top-[4%] left-[5%] right-[5%] z-30 flex items-center justify-between">
                {brandLogo ? (
                    <img src={brandLogo} alt="Logo" className="h-[4%] object-contain"/>
                ) : (
                    <span className={`font-bold text-[0.4rem] ${isLightBg ? 'text-gray-600' : 'text-gray-300'}`}>{authorName}</span>
                )}
                 <span className={`font-mono text-[0.4rem] ${isLightBg ? 'text-black/50' : 'text-white/50'}`}>
                    {slideNumber}/{totalSlides}
                </span>
            </header>
            <main className={`relative z-20 w-full flex-grow flex flex-col pt-[12%] ${vAlign}`}>
                <h2 className={`break-words ${titleFontClass} ${titleAlign}`} style={{ fontSize: `${titleFontSize / 16 / scaleFactor}rem`, color: finalTitleColor, fontWeight: isTitleBold ? 'bold' : 'normal', fontStyle: isTitleItalic ? 'italic' : 'normal', lineHeight: 1.1 }}>
                    {title}
                </h2>
                <div className={`mt-1 break-words ${contentFontClass} ${contentAlign}`} style={{ fontSize: `${contentFontSize / 16 / scaleFactor}rem`, color: finalContentColor, fontWeight: isContentBold ? 'bold' : 'normal', fontStyle: isContentItalic ? 'italic' : 'normal', lineHeight: contentLineHeight }}>
                    {content.length > 50 ? `${content.substring(0, 50)}...` : content}
                </div>
            </main>
        </div>
    );
};

const ExportPreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onExport: (type: 'png' | 'pdf') => void;
    slides: EditableSlideData[];
    brandSettings: { logo: string | null; authorName: string };
    isSharing: boolean;
    shareType: 'png' | 'pdf' | null;
    theme: 'dark' | 'light';
    contentType: ContentType;
}> = ({ isOpen, onClose, onExport, slides, brandSettings, isSharing, shareType, theme, contentType }) => {
    if (!isOpen) return null;
    const isStories = contentType === 'stories';
    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col p-4 animate-fade-in" onClick={onClose}>
            <div className={`flex-shrink-0 flex items-center justify-between pb-4`}>
                <h3 className="font-bebas text-3xl text-white">Предпросмотр</h3>
                <button onClick={onClose} className="p-2 -m-2 text-gray-300 hover:text-white"><XIcon className="w-6 h-6"/></button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar -mr-4 pr-4">
                <div className={`grid gap-4 ${isStories ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {slides.map((slide, index) => (
                        <div key={slide.id} className={`${isStories ? 'aspect-[9/16]' : 'aspect-square'}`}>
                            <SlidePreview slide={slide} brandLogo={brandSettings.logo} authorName={brandSettings.authorName} slideNumber={index + 1} totalSlides={slides.length}/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-3">
                <button onClick={() => onExport('png')} disabled={isSharing} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white transition-colors duration-200 bg-purple-500 rounded-xl hover:bg-purple-600 disabled:opacity-50">
                    {isSharing && shareType === 'png' ? <LoadingSpinner/> : <ImageIcon className="w-5 h-5"/>}
                    Скачать PNG (.zip)
                </button>
                 <button onClick={() => onExport('pdf')} disabled={isSharing} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white transition-colors duration-200 bg-purple-500 rounded-xl hover:bg-purple-600 disabled:opacity-50">
                    {isSharing && shareType === 'pdf' ? <LoadingSpinner/> : <DownloadIcon className="w-5 h-5"/>}
                    Скачать PDF
                </button>
            </div>
        </div>
    );
};


const EditorScreen: React.FC<EditorScreenProps> = ({ onBack, carouselData, onNavigate, contentType = 'carousel', theme }) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [slides, setSlides] = useState<EditableSlideData[]>([]);
  const [brandSettings, setBrandSettings] = useState({ logo: null as string | null, authorName: '@change_hr' });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  const handleUpdateBrandSettings = useCallback((settings: { logo?: string | null; authorName?: string }) => {
    setBrandSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareType, setShareType] = useState<'png' | 'pdf' | null>(null);
  const [currentFormat, setCurrentFormat] = useState<ContentType>(contentType);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  const timeSince = (date: Date | null): string => {
      if (!date) return '';
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 2) return 'только что';
      if (seconds < 60) return `${seconds} сек. назад`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} мин. назад`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} ч. назад`;
      const days = Math.floor(hours / 24);
      return `${days} д. назад`;
  };

  useEffect(() => {
    if (carouselData) {
        setSlides(carouselData.map((slide, index) => ({
            ...slide, 
            id: `${Date.now()}-${index}`, 
            backgroundId: 11,
            backgroundImage: null,
            titleAlign: 'text-left',
            contentAlign: 'text-left',
            vAlign: 'justify-center',
            customBackgroundColor: undefined,
            highlightColor: '#dfff00',
            ...DEFAULT_TEXT_STYLES,
        })));
        setSelectedSlideIndex(0);
        setLastSaved(new Date());
    }
  }, [carouselData]);

  // Auto-save effect
  useEffect(() => {
    if (!lastSaved) return; // Don't save on initial load

    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
        setIsSaving(true);
        // Simulate network delay for saving
        setTimeout(() => {
            // In a real app, this would be an API call to save the project.
            setIsSaving(false);
            setLastSaved(new Date());
        }, 750);
    }, 2000); // Autosave 2 seconds after the last change

    // Cleanup on unmount
    return () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [slides, brandSettings, lastSaved]);

  useEffect(() => {
    setCurrentFormat(contentType);
  }, [contentType]);

  useEffect(() => {
    slideContainerRef.current?.scrollTo({
      left: selectedSlideIndex * slideContainerRef.current.offsetWidth,
      behavior: 'smooth'
    });
  }, [selectedSlideIndex]);
  
  const handleScroll = () => {
    if (!slideContainerRef.current) return;
    const { scrollLeft, offsetWidth } = slideContainerRef.current;
    const newIndex = Math.round(scrollLeft / offsetWidth);
    if (newIndex !== selectedSlideIndex) {
      setSelectedSlideIndex(newIndex);
    }
  };

  const updateSlide = useCallback((slideId: string, updates: Partial<EditableSlideData>) => {
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, ...updates } : s));
  }, []);

  const handleTextChange = (slideId: string, field: 'title' | 'content', newText: string) => {
      updateSlide(slideId, { [field]: newText });
  };

  const handleAddSlide = (afterIndex: number) => {
    if (slides.length >= 10) return;
    const basisSlide = slides[afterIndex] || slides[0];
    const newSlide: EditableSlideData = {
        id: `${Date.now()}`, title: 'Новый заголовок', content: 'Добавьте ваше описание.', highlight_keywords: [], image_prompt: `abstract design ${Math.random()}`,
        backgroundId: basisSlide?.backgroundId ?? 11,
        backgroundImage: basisSlide?.backgroundImage ?? null,
        titleAlign: basisSlide?.titleAlign ?? 'text-left',
        contentAlign: basisSlide?.contentAlign ?? 'text-left',
        vAlign: basisSlide?.vAlign ?? 'justify-center',
        customBackgroundColor: basisSlide?.customBackgroundColor,
        highlightColor: basisSlide?.highlightColor ?? '#dfff00',
        titleFontClass: basisSlide?.titleFontClass ?? DEFAULT_TEXT_STYLES.titleFontClass,
        contentFontClass: basisSlide?.contentFontClass ?? DEFAULT_TEXT_STYLES.contentFontClass,
        titleFontSize: basisSlide?.titleFontSize ?? DEFAULT_TEXT_STYLES.titleFontSize,
        contentFontSize: basisSlide?.contentFontSize ?? DEFAULT_TEXT_STYLES.contentFontSize,
        titleColor: basisSlide?.titleColor ?? DEFAULT_TEXT_STYLES.titleColor,
        contentColor: basisSlide?.contentColor ?? DEFAULT_TEXT_STYLES.contentColor,
        isTitleBold: basisSlide?.isTitleBold ?? DEFAULT_TEXT_STYLES.isTitleBold,
        isTitleItalic: basisSlide?.isTitleItalic ?? DEFAULT_TEXT_STYLES.isTitleItalic,
        isContentBold: basisSlide?.isContentBold ?? DEFAULT_TEXT_STYLES.isContentBold,
        isContentItalic: basisSlide?.isContentItalic ?? DEFAULT_TEXT_STYLES.isContentItalic,
        contentLineHeight: basisSlide?.contentLineHeight ?? DEFAULT_TEXT_STYLES.contentLineHeight,
    };
    const newIndex = afterIndex + 1;
    setSlides(prev => [...prev.slice(0, newIndex), newSlide, ...prev.slice(newIndex)]);
    setTimeout(() => setSelectedSlideIndex(newIndex), 100);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== selectedSlideIndex));
    setSelectedSlideIndex(prev => Math.max(0, prev - 1));
  };

  const handleDuplicateSlide = () => {
    if (slides.length >= 10) return;
    const slideToDuplicate = slides[selectedSlideIndex];
    const newSlide = { ...slideToDuplicate, id: `${Date.now()}` };
    const newIndex = selectedSlideIndex + 1;
    setSlides(prev => [...prev.slice(0, newIndex), newSlide, ...prev.slice(newIndex)]);
    setTimeout(() => setSelectedSlideIndex(newIndex), 100);
  };
  
  const handleApplyTemplate = (template: TemplateDefinition, applyToAll: boolean) => {
    const updates = { ...template, backgroundImage: null }; // Applying a template resets the custom image
    if (applyToAll) {
      setSlides(prev => prev.map(slide => ({ ...slide, ...updates })));
    } else if (currentSlide) {
      updateSlide(currentSlide.id, updates);
    }
  };
  
  const handleApplyCustomBackground = (image: string, applyToAll: boolean) => {
    const updates = {
      backgroundImage: image,
      backgroundId: 0, 
      customBackgroundColor: undefined,
    };
    if (applyToAll) {
      setSlides(prev => prev.map(slide => ({ ...slide, ...updates })));
    } else if (currentSlide) {
      updateSlide(currentSlide.id, updates);
    }
  };

  const handleAddUserImage = (image: string) => {
      if (!userImages.includes(image)) {
          setUserImages(prev => [image, ...prev]);
      }
  };

  const handleExport = async (type: 'png' | 'pdf') => {
      if (isSharing) return;
      setIsSharing(true);
      setShareType(type);
      const isStoriesFormat = currentFormat === 'stories';
  
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0px';
      document.body.appendChild(container);
  
      const canvasPromises = slides.map((slide, index) => {
          const slideElement = document.createElement('div');
          const canvasSize = isStoriesFormat ? { width: 1080, height: 1920 } : { width: 1080, height: 1080 };
          slideElement.style.width = `${canvasSize.width}px`;
          slideElement.style.height = `${canvasSize.height}px`;
          container.appendChild(slideElement);
  
          // Fix: `root.render` only takes one argument. The promise executor is now async
          // to allow awaiting the screenshot after rendering.
          return new Promise<HTMLCanvasElement>(async (resolve) => {
              const root = ReactDOM.createRoot(slideElement);
              root.render(
                  <div style={{ width: '100%', height: '100%' }}>
                      <CoverComponent 
                          slide={slide} 
                          onTextChange={() => {}}
                          brandLogo={brandSettings.logo} 
                          authorName={brandSettings.authorName}
                          slideNumber={index + 1}
                          totalSlides={slides.length}
                      />
                  </div>
              );
              
              await new Promise(res => setTimeout(res, 500));
              const canvas = await html2canvas(slideElement, { 
                  useCORS: true, 
                  allowTaint: true,
                  backgroundColor: '#000000',
                  width: canvasSize.width,
                  height: canvasSize.height,
                  scale: 1,
              });
              root.unmount();
              container.removeChild(slideElement);
              resolve(canvas);
          });
      });
  
      const canvases = await Promise.all(canvasPromises);
  
      if (type === 'png') {
          const zip = new JSZip();
          canvases.forEach((canvas, index) => {
              const imageData = canvas.toDataURL('image/png').split(',')[1];
              zip.file(`slide-${index + 1}.png`, imageData, { base64: true });
          });
          const content = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'MOVE_Project.zip';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  
      if (type === 'pdf') {
          const { jsPDF } = jspdf;
          const orientation = isStoriesFormat ? 'p' : 'l';
          const pdf = new jsPDF(orientation, 'px', [canvases[0].width, canvases[0].height]);
          
          canvases.forEach((canvas, index) => {
              if (index > 0) {
                  pdf.addPage([canvas.width, canvas.height], orientation);
              }
              const imgData = canvas.toDataURL('image/png');
              pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          });
          pdf.save('MOVE_Project.pdf');
      }
  
      document.body.removeChild(container);
      setIsSharing(false);
      setShareType(null);
      setIsExportPreviewOpen(false);
  };
  
  const handleSelectFormat = (format: ContentType) => {
    setIsConversionModalOpen(false);
    switch (format) {
        case 'post':
            onNavigate(Screen.TextPost);
            break;
        case 'threads':
            onNavigate(Screen.Threads);
            break;
        case 'newsletter':
            onNavigate(Screen.Newsletter);
            break;
        case 'reels':
            onNavigate(Screen.Reels);
            break;
        case 'carousel':
        case 'stories':
        default:
            setCurrentFormat(format);
            break;
    }
  };

  const currentSlide = slides[selectedSlideIndex];
  const isStories = currentFormat === 'stories';
  const canvasContainerClass = `w-full mx-auto transition-all duration-300 ${isStories ? 'aspect-[9/16] max-w-[281px] sm:max-w-[337px]' : 'aspect-square max-w-[500px]'}`;

  const topHeaderBg = theme === 'dark' ? 'bg-gradient-to-b from-black/50 to-transparent' : '';
  const toolbarBg = theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10' : 'bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg';
  
  return (
    <div className="w-full h-full flex flex-col font-sans overflow-hidden">
        <header className={`absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-30 ${topHeaderBg}`}>
            <IconButton onClick={onBack} tooltip="Назад" theme={theme}><BackIcon className="w-5 h-5" /></IconButton>
            <div className="flex flex-col items-center">
                <div style={{ perspective: '800px' }}>
                  <h1 className="font-bebas text-2xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h1>
                </div>
                <div className="text-xs text-gray-400 h-4 mt-0.5" style={{ minWidth: '120px', textAlign: 'center' }}>
                  {isSaving 
                    ? '💾 Сохранение...' 
                    : (lastSaved ? `✓ Сохранено ${timeSince(lastSaved)}` : '')
                  }
                </div>
            </div>
            <div className="w-8"></div>
        </header>

        <main className="flex-grow w-full flex flex-col justify-center items-center p-4 pt-20 pb-28">
            <div ref={slideContainerRef} onScroll={handleScroll} className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="w-full flex-shrink-0 snap-center flex justify-center items-center relative">
                         <div className={canvasContainerClass}>
                             <CoverComponent slide={slide} onTextChange={handleTextChange} brandLogo={brandSettings.logo} authorName={brandSettings.authorName} slideNumber={index + 1} totalSlides={slides.length} />
                         </div>
                         {slides.length < 10 && (
                            <button
                                onClick={() => handleAddSlide(index)}
                                className="absolute z-20 top-1/2 -translate-y-1/2 right-2 translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                aria-label="Добавить слайд после этого"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                         )}
                    </div>
                ))}
            </div>
            
            <div className="flex-shrink-0 mt-4 flex flex-wrap items-center justify-center gap-2">
                <IconButton onClick={() => setSelectedSlideIndex(p => Math.max(0, p - 1))} disabled={selectedSlideIndex === 0} theme={theme}><ChevronLeftIcon className="w-6 h-6"/></IconButton>
                
                <div className={`flex items-center gap-1 p-1 rounded-2xl border ${toolbarBg}`}>
                    <IconButton onClick={handleDuplicateSlide} tooltip="Дублировать" disabled={slides.length >= 10} theme={theme}><CopyIcon className="w-5 h-5"/></IconButton>
                    <IconButton onClick={handleDeleteSlide} tooltip="Удалить" disabled={slides.length <= 1} theme={theme}><Trash2Icon className="w-5 h-5"/></IconButton>
                </div>
            
                <div className={`flex items-center gap-1 p-1 rounded-2xl border ${toolbarBg}`}>
                    <IconButton isActive={currentSlide?.contentAlign === 'text-left'} onClick={() => currentSlide && updateSlide(currentSlide.id, { contentAlign: 'text-left', titleAlign: 'text-left' })} tooltip="По левому краю" theme={theme}><AlignLeftIcon className="w-5 h-5"/></IconButton>
                    <IconButton isActive={currentSlide?.contentAlign === 'text-center'} onClick={() => currentSlide && updateSlide(currentSlide.id, { contentAlign: 'text-center', titleAlign: 'text-center' })} tooltip="По центру" theme={theme}><AlignCenterHorizontalIcon className="w-5 h-5"/></IconButton>
                    <IconButton isActive={currentSlide?.contentAlign === 'text-right'} onClick={() => currentSlide && updateSlide(currentSlide.id, { contentAlign: 'text-right', titleAlign: 'text-right' })} tooltip="По правому краю" theme={theme}><AlignRightIcon className="w-5 h-5"/></IconButton>
                </div>
            
                <div className={`flex items-center gap-1 p-1 rounded-2xl border ${toolbarBg}`}>
                    <IconButton isActive={currentSlide?.vAlign === 'justify-start'} onClick={() => currentSlide && updateSlide(currentSlide.id, { vAlign: 'justify-start' })} tooltip="Сверху" theme={theme}><AlignVerticalJustifyStartIcon className="w-5 h-5"/></IconButton>
                    <IconButton isActive={currentSlide?.vAlign === 'justify-center'} onClick={() => currentSlide && updateSlide(currentSlide.id, { vAlign: 'justify-center' })} tooltip="Посередине" theme={theme}><AlignVerticalJustifyCenterIcon className="w-5 h-5"/></IconButton>
                    <IconButton isActive={currentSlide?.vAlign === 'justify-end'} onClick={() => currentSlide && updateSlide(currentSlide.id, { vAlign: 'justify-end' })} tooltip="Снизу" theme={theme}><AlignVerticalJustifyEndIcon className="w-5 h-5"/></IconButton>
                </div>
            
                <IconButton onClick={() => setSelectedSlideIndex(p => Math.min(slides.length - 1, p + 1))} disabled={selectedSlideIndex === slides.length - 1} theme={theme}><ChevronRightIcon className="w-6 h-6"/></IconButton>
            </div>
        </main>
        
        <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${activePanel ? 'translate-y-0' : 'translate-y-full'}`}>
            {currentSlide && <EditingPanel activePanel={activePanel} onClose={() => setActivePanel(null)} theme={theme}>
                {activePanel === 'TEMPLATE' && <LayoutPanelContent onApplyTemplate={handleApplyTemplate} onApplyCustomBackground={handleApplyCustomBackground} onAddUserImage={handleAddUserImage} userImages={userImages} theme={theme} />}
                {activePanel === 'BACKGROUND' && <BackgroundPanelContent currentSlide={currentSlide} onUpdate={(updates) => updateSlide(currentSlide.id, updates)} theme={theme} />}
                {activePanel === 'TEXT' && <TextPanelContent currentSlide={currentSlide} onUpdate={(updates) => updateSlide(currentSlide.id, updates)} theme={theme} />}
                {activePanel === 'BRAND' && <BrandPanelContent brandSettings={brandSettings} onUpdateBrandSettings={handleUpdateBrandSettings} theme={theme} />}
            </EditingPanel>}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-4 px-4">
            <div className={`max-w-lg mx-auto border rounded-2xl p-2 flex items-center justify-around h-20 transition-transform duration-300 ease-in-out ${toolbarBg} ${activePanel ? 'translate-y-96' : 'translate-y-0'}`}>
                <IconButton vertical label="Шаблон" isActive={activePanel === 'TEMPLATE'} onClick={() => setActivePanel(p => p === 'TEMPLATE' ? null : 'TEMPLATE')} theme={theme}><LayoutTemplateIcon className="w-6 h-6" /></IconButton>
                <IconButton vertical label="Фон" isActive={activePanel === 'BACKGROUND'} onClick={() => setActivePanel(p => p === 'BACKGROUND' ? null : 'BACKGROUND')} theme={theme}><PaintBucketIcon className="w-6 h-6" /></IconButton>
                <IconButton vertical label="Текст" isActive={activePanel === 'TEXT'} onClick={() => setActivePanel(p => p === 'TEXT' ? null : 'TEXT')} theme={theme}><TypeIcon className="w-6 h-6"/></IconButton>
                <IconButton vertical label="Бренд" isActive={activePanel === 'BRAND'} onClick={() => setActivePanel(p => p === 'BRAND' ? null : 'BRAND')} theme={theme}><GemIcon className="w-6 h-6"/></IconButton>
                <div className={`w-px self-stretch my-3 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                <IconButton vertical label="Конверт." onClick={() => setIsConversionModalOpen(true)} theme={theme}><RepeatIcon className="w-6 h-6"/></IconButton>
                <div className="relative">
                     <button onClick={() => setIsExportPreviewOpen(true)} className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg text-white bg-gradient-to-br from-purple-600 to-violet-500 shadow-lg shadow-purple-500/30">
                        <Share2Icon className="w-6 h-6" />
                        <span className="text-xs font-semibold">Экспорт</span>
                    </button>
                </div>
            </div>
        </div>

        <FormatConversionModal
          isOpen={isConversionModalOpen}
          onClose={() => setIsConversionModalOpen(false)}
          onSelect={handleSelectFormat}
          currentFormat={currentFormat}
          theme={theme}
        />
        <ExportPreviewModal
            isOpen={isExportPreviewOpen}
            onClose={() => setIsExportPreviewOpen(false)}
            onExport={handleExport}
            slides={slides}
            brandSettings={brandSettings}
            isSharing={isSharing}
            shareType={shareType}
            theme={theme}
            contentType={currentFormat}
        />
    </div>
  );
};

export default EditorScreen;
