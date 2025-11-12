import React, { useState } from 'react';
import { Screen } from '../types';
import BottomNavBar from '../components/BottomNavBar';
import { ChevronRightIcon, CreditCardIcon, GlobeIcon, LifeBuoyIcon, MoonIcon, UserIcon, XIcon, CheckIcon, GiftIcon, CopyIcon } from '../constants';

const LANGUAGES = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English (USA)' },
    { code: 'uk', name: 'Українська' },
    { code: 'be', name: 'Беларуская' },
    { code: 'kk', name: 'Қазақ тілі' },
    { code: 'uz', name: 'O‘zbek tili' },
    { code: 'az', name: 'Azərbaycan dili' },
    { code: 'hy', name: 'Հայերեն' },
    { code: 'ka', name: 'ქართული' },
    { code: 'en-gb', name: 'English (UK)' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'zh', name: '中文 (简体)' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
];

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; theme: 'dark' | 'light' }> = ({ title, children, theme }) => (
    <div className="mb-6">
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 px-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{title}</h3>
        <div className={`rounded-xl border ${
            theme === 'dark' 
            ? 'backdrop-blur-xl bg-white/5 border-white/10 divide-white/10' 
            : 'bg-white border-gray-200 divide-gray-200 shadow-sm'
        } divide-y`}>
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode; onClick?: () => void; theme: 'dark' | 'light' }> = ({ icon, label, children, onClick, theme }) => {
    const Component = onClick ? 'button' : 'div';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const hoverBg = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-50';

    return (
        <Component onClick={onClick} className={`flex items-center w-full justify-between p-4 min-h-[60px] ${onClick ? `${hoverBg} transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl` : ''}`}>
            <div className="flex items-center gap-4 flex-1 truncate">
                <div className={`${secondaryTextColor} flex-shrink-0`}>{icon}</div>
                <span className={`font-semibold truncate ${textColor}`}>{label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {children}
            </div>
        </Component>
    );
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; theme: 'dark' | 'light' }> = ({ checked, onChange, theme }) => (
    <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-black' : 'focus:ring-offset-white'} ${checked ? 'bg-purple-600' : (theme === 'dark' ? 'bg-white/20' : 'bg-gray-200')}`}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
);

const subscription = {
    plan: 'MOVE Pro',
    paidOn: '15 Июля 2024',
    expiresOn: '15 Августа 2024'
};

const TariffModal: React.FC<{ isOpen: boolean; onClose: () => void; theme: 'dark' | 'light' }> = ({ isOpen, onClose, theme }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`rounded-2xl p-6 w-full max-w-sm border ${theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bebas text-3xl">Тарифный план</h3>
                    <button onClick={onClose} className={`p-2 -m-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className={`space-y-3 text-sm mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex justify-between"><span>Текущий тариф:</span> <span className="font-bold text-purple-400">{subscription.plan}</span></div>
                    <div className="flex justify-between"><span>Оплачен:</span> <span className="font-semibold">{subscription.paidOn}</span></div>
                    <div className="flex justify-between"><span>Истекает:</span> <span className="font-semibold">{subscription.expiresOn}</span></div>
                </div>
                <div className="flex flex-col gap-3">
                    <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">Отменить подписку</button>
                    <button onClick={onClose} className={`w-full font-bold py-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};

const LanguageModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    currentLanguageCode: string;
    onSelect: (code: string) => void;
    theme: 'dark' | 'light';
}> = ({ isOpen, onClose, currentLanguageCode, onSelect, theme }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`rounded-2xl w-full max-w-sm flex flex-col border ${theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10' : 'bg-white border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                    <h3 className={`font-bebas text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите язык</h3>
                    <button onClick={onClose} className={`p-2 -m-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <ul className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {LANGUAGES.map(lang => (
                        <li key={lang.code}>
                            <button 
                                onClick={() => onSelect(lang.code)}
                                className={`w-full text-left flex justify-between items-center px-4 py-3 transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-50'}`}
                            >
                                <span className={`font-semibold ${currentLanguageCode === lang.code ? 'text-purple-400' : (theme === 'dark' ? 'text-white' : 'text-gray-800')}`}>
                                    {lang.name}
                                </span>
                                {currentLanguageCode === lang.code && <CheckIcon className="w-5 h-5 text-purple-400"/>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ReferralModal: React.FC<{ isOpen: boolean; onClose: () => void; theme: 'dark' | 'light' }> = ({ isOpen, onClose, theme }) => {
    const referralCode = 'MOVE-KASPI-24';
    const referralLink = `https://move-app.kz/invite?code=${referralCode}`;
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`rounded-2xl p-6 w-full max-w-sm border ${theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bebas text-3xl">Пригласите друзей</h3>
                    <button onClick={onClose} className={`p-2 -m-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Поделитесь любовью к MOVE и получите вознаграждение!</p>
                
                <div className="space-y-4 mb-8">
                    <div className="bg-green-900/50 border border-green-500/20 rounded-lg p-4 text-center">
                        <p className="font-bold text-green-300">Вам</p>
                        <p className="text-2xl font-bold text-green-200 mt-1">5 000 ₸ на Kaspi</p>
                        <p className="text-xs text-green-400 mt-1">за каждого друга с подпиской Pro</p>
                    </div>
                     <div className="bg-purple-900/50 border border-purple-500/20 rounded-lg p-4 text-center">
                        <p className="font-bold text-purple-300">Другу</p>
                        <p className="text-2xl font-bold text-purple-200 mt-1">Скидка 20%</p>
                        <p className="text-xs text-purple-400 mt-1">на первый месяц подписки</p>
                    </div>
                </div>

                <div>
                    <label className={`text-xs font-bold uppercase mb-2 block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Ваша реферальная ссылка</label>
                    <div className={`flex items-center rounded-lg pr-2 border ${theme === 'dark' ? 'bg-black/30 border-white/20' : 'bg-gray-100 border-gray-300'}`}>
                        <input 
                            type="text" 
                            readOnly 
                            value={referralLink}
                            className={`flex-grow bg-transparent p-3 text-sm font-mono focus:outline-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        />
                        <button onClick={handleCopy} className={`p-2 transition-colors rounded-md ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                            <CopyIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleCopy}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    {copied ? 'Ссылка скопирована!' : 'Поделиться ссылкой'}
                </button>

            </div>
        </div>
    );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, theme, toggleTheme }) => {
    const [languageCode, setLanguageCode] = useState('ru');
    const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    const handleSelectLanguage = (code: string) => {
        setLanguageCode(code);
        setIsLanguageModalOpen(false);
    };

    const userProfile = {
        name: 'Алексей С.',
        region: 'Казахстан',
        type: 'Частное лицо',
        field: 'Маркетинг и SMM'
    };

    return (
        <>
            <div className="w-full h-full overflow-hidden max-w-lg mx-auto p-4 sm:p-6 flex flex-col">
                <header className="flex-shrink-0">
                    <div style={{ perspective: '1000px' }}>
                        <h2 className="font-bebas text-6xl sm:text-7xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h2>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto py-6 -mr-4 pr-4 pb-24 custom-scrollbar">
                    {/* Interface Settings */}
                    <SettingsSection title="Настройки интерфейса" theme={theme}>
                        <SettingsRow icon={<MoonIcon className="w-6 h-6"/>} label="Темная тема" theme={theme}>
                           <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} theme={theme} />
                        </SettingsRow>
                        <SettingsRow icon={<GlobeIcon className="w-6 h-6"/>} label="Язык" onClick={() => setIsLanguageModalOpen(true)} theme={theme}>
                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                {LANGUAGES.find(l => l.code === languageCode)?.name || 'Русский'}
                            </span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                    </SettingsSection>

                    {/* Referral Program */}
                    <SettingsSection title="Реферальная программа" theme={theme}>
                        <SettingsRow icon={<GiftIcon className="w-6 h-6"/>} label="Пригласить друга" onClick={() => setIsReferralModalOpen(true)} theme={theme}>
                            <span className="font-bold text-green-400">Получите 5000 ₸</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                    </SettingsSection>

                    {/* Subscription */}
                    <SettingsSection title="Тарифный план" theme={theme}>
                        <SettingsRow icon={<CreditCardIcon className="w-6 h-6"/>} label="Моя подписка" onClick={() => setIsTariffModalOpen(true)} theme={theme}>
                            <span className="font-bold text-purple-400">{subscription.plan}</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                    </SettingsSection>
                    
                    {/* Personal Info */}
                    <SettingsSection title="Личная информация" theme={theme}>
                        <SettingsRow icon={<UserIcon className="w-6 h-6"/>} label="Имя" onClick={() => {}} theme={theme}>
                            <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{userProfile.name}</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                        <SettingsRow icon={<UserIcon className="w-6 h-6"/>} label="Регион" onClick={() => {}} theme={theme}>
                            <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{userProfile.region}</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                        <SettingsRow icon={<UserIcon className="w-6 h-6"/>} label="Сфера" onClick={() => {}} theme={theme}>
                            <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{userProfile.field}</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                    </SettingsSection>

                    {/* Support */}
                    <SettingsSection title="Поддержка" theme={theme}>
                        <SettingsRow icon={<LifeBuoyIcon className="w-6 h-6"/>} label="Написать в поддержку" onClick={() => {}} theme={theme}>
                            <ChevronRightIcon className="w-5 h-5 text-gray-500"/>
                        </SettingsRow>
                    </SettingsSection>
                </main>
                
                <BottomNavBar activeScreen={Screen.Settings} onNavigate={onNavigate} theme={theme} />
            </div>
            <TariffModal isOpen={isTariffModalOpen} onClose={() => setIsTariffModalOpen(false)} theme={theme} />
            <LanguageModal 
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
                currentLanguageCode={languageCode}
                onSelect={handleSelectLanguage}
                theme={theme}
            />
            <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} theme={theme} />
        </>
    );
};

export default SettingsScreen;