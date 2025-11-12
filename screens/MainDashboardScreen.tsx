import React, { useState, useMemo } from 'react';
import { WandSparklesIcon, XIcon, ArrowRightIcon } from '../constants';
import { Screen } from '../types';
import BottomNavBar from '../components/BottomNavBar';
import GradientButton from '../components/GradientButton';

interface Trend {
    title: string;
    summary: string;
    full_text: string;
    source: string;
}

// Mock Data for Trends with full text
const MOCK_TRENDS: { [key: string]: Trend[] } = {
    'tech': [
      { title: 'AI-агенты меняют всё', summary: 'Автономные AI-агенты начинают выполнять сложные задачи без участия человека, от планирования до исполнения.', full_text: 'Автономные AI-агенты, такие как Auto-GPT и BabyAGI, демонстрируют способность к самостоятельному планированию, поиску информации и выполнению многошаговых задач. Это открывает новые горизонты для автоматизации в бизнесе, от маркетинговых исследований до разработки программного кода. Основная проблема на данный момент — "галлюцинации" и высокая стоимость операций, но технология развивается экспоненциально.', source: 'TechCrunch' },
      { title: 'Пространственные вычисления', summary: 'Apple Vision Pro задает новый тренд на взаимодействие с цифровым контентом в пространстве.', full_text: 'С выходом Apple Vision Pro концепция пространственных вычислений становится доступной массовому потребителю. Это не просто VR, а полноценная платформа для работы, развлечений и общения, интегрированная в реальный мир. Разработчики активно создают приложения, которые изменят то, как мы взаимодействуем с данными.', source: 'The Verge' },
      { title: 'Квантовые вычисления в облаке', summary: 'Крупные облачные провайдеры открывают доступ к квантовым компьютерам, ускоряя исследования.', full_text: 'Компании вроде IBM, Google и Microsoft предоставляют облачный доступ к своим квантовым компьютерам. Это позволяет стартапам и исследовательским институтам проводить сложные симуляции в области медицины, материаловедения и финансов, не строя собственные дорогостоящие установки.', source: 'Wired' },
    ],
    'marketing': [
      { title: 'Гиперперсонализация в реальном времени', summary: 'Бренды используют AI для создания уникальных предложений для каждого клиента прямо в момент взаимодействия.', full_text: 'AI-алгоритмы анализируют поведение пользователя на сайте в реальном времени и мгновенно адаптируют контент, предложения и даже цены. Это приводит к значительному увеличению конверсии и лояльности, так как каждый клиент чувствует, что предложение создано специально для него.', source: 'Marketing AI Institute' },
      { title: 'UGC > брендовый контент', summary: 'Пользовательский контент продолжает доминировать по доверию и вовлеченности аудитории.', full_text: 'Исследования показывают, что потребители доверяют отзывам и контенту от других пользователей в несколько раз больше, чем официальной рекламе брендов. Успешные компании активно стимулируют создание UGC и интегрируют его в свои маркетинговые кампании, делая клиентов своими амбассадорами.', source: 'HubSpot Blog' },
      { title: 'Конец第三方 cookie', summary: 'Маркетологи активно ищут новые способы таргетинга в связи с отказом Google от сторонних cookie.', full_text: 'С отказом от third-party cookies в Chrome, маркетологи переходят на новые методы сбора данных, такие как first-party data (собственные данные компании), контекстуальный таргетинг и использование "песочницы конфиденциальности" Google. Это требует перестройки стратегий и большего фокуса на построении прямых отношений с клиентами.', source: 'Search Engine Land' },
    ],
    'design': [
        { title: 'Брутализм возвращается', summary: 'Смелая типографика, резкие линии и "сырой" вид снова в моде в веб-дизайне.', full_text: 'Цифровой брутализм — это протест против однотипных и "вылизанных" интерфейсов. Он характеризуется отсутствием градиентов, теней, использованием системных шрифтов и смелой, часто асимметричной версткой. Этот стиль привлекает внимание и подчёркивает аутентичность бренда.', source: 'Awwwards' },
        { title: 'AI в инструментах дизайна', summary: 'Интеграция генеративных AI в Figma и Adobe меняет рабочий процесс дизайнеров.', full_text: 'Инструменты вроде Midjourney, Dall-E и встроенные AI-функции в Figma и Photoshop позволяют дизайнерам быстро генерировать идеи, создавать изображения по текстовому описанию и автоматизировать рутинные задачи, такие как создание вариантов дизайна или удаление фона. Это ускоряет работу и позволяет больше времени уделять креативу.', source: 'Figma Blog' },
    ],
    'finance': [
        { title: 'Токенизация реальных активов (RWA)', summary: 'Перевод реальных активов, таких как недвижимость и искусство, в блокчейн-токены становится главным трендом в DeFi.', full_text: 'Токенизация позволяет "разбить" дорогие активы, такие как здание или картина, на множество цифровых токенов, которые можно свободно продавать на вторичном рынке. Это повышает ликвидность и делает инвестиции в реальные активы доступными для более широкого круга инвесторов.', source: 'CoinDesk' },
        { title: 'Встроенные финансы (Embedded Finance)', summary: 'Финансовые услуги всё глубже интегрируются в нефинансовые платформы, делая их незаметными для пользователя.', full_text: 'Теперь вы можете получить кредит на покупку прямо в приложении интернет-магазина или застраховать поездку при бронировании билетов. Компании, не являющиеся банками, встраивают финансовые продукты в свой сервис, улучшая пользовательский опыт и открывая новые источники дохода.', source: 'Forbes' },
    ],
    'health': [
        { title: 'Носимые гаджеты для ментального здоровья', summary: 'Устройства отслеживают уровень стресса и предлагают техники релаксации в реальном времени.', full_text: 'Новое поколение носимых устройств, таких как кольца и браслеты, отслеживает не только физические показатели, но и биомаркеры стресса (например, вариабельность сердечного ритма). Приложения, связанные с ними, предлагают медитации, дыхательные упражнения и другие техники для улучшения ментального состояния.', source: 'CNET' },
        { title: 'Персонализированное питание на основе ДНК', summary: 'Стартапы предлагают диеты, составленные на основе генетического анализа.', full_text: 'Сдав ДНК-тест, вы можете получить рекомендации по питанию, которые учитывают вашу генетическую предрасположенность к усвоению тех или иных нутриентов, риски заболеваний и метаболические особенности. Это новый шаг в персонализированной медицине и диетологии.', source: 'Healthline' },
    ],
    'crypto': [
        { title: 'Layer 2 решения для Ethereum', summary: 'Arbitrum, Optimism и другие L2-сети продолжают снижать комиссии и ускорять транзакции.', full_text: 'Поскольку основная сеть Ethereum остаётся медленной и дорогой, решения второго уровня (Layer 2) берут на себя основную нагрузку. Они обрабатывают транзакции вне основной цепи, а затем записывают в неё только результат, что делает DeFi и NFT-операции доступными для всех.', source: 'Decrypt' },
        { title: 'DePIN - Децентрализованные физические сети', summary: 'Блокчейн используется для создания и управления реальной инфраструктурой, от Wi-Fi до солнечных панелей.', full_text: 'DePIN (Decentralized Physical Infrastructure Networks) — это концепция, где люди по всему миру могут совместно владеть и управлять физической инфраструктурой. Например, проект Helium позволяет пользователям разворачивать точки доступа Wi-Fi и получать за это вознаграждение в криптовалюте, создавая глобальную децентрализованную сеть.', source: 'Messari' },
    ],
    'art': [
        { title: 'Иммерсивные выставки', summary: 'Цифровые инсталляции и VR-опыты становятся главным форматом для музеев и галерей.', full_text: 'Вместо того чтобы просто смотреть на картины, посетители погружаются в них с помощью огромных проекций, звуковых эффектов и виртуальной реальности. Такие выставки, как "Van Gogh: The Immersive Experience", привлекают новую, более молодую аудиторию и становятся вирусными в социальных сетях.', source: 'Artnet News' },
        { title: 'AI-искусство и этика', summary: 'Продолжаются дебаты о правах художников и оригинальности произведений, созданных нейросетями.', full_text: 'Генеративные нейросети, обученные на миллионах изображений из интернета, ставят под вопрос понятия авторства и оригинальности. Юристы и художники обсуждают, кому принадлежат права на AI-произведения и является ли использование чужих работ для обучения нейросети нарушением авторских прав. Эти дебаты формируют будущее креативной индустрии.', source: 'The Art Newspaper' },
    ]
};

const ALL_TOPICS = [
    {key: 'auto', label: 'Авто и транспорт'},
    {key: 'art', label: 'Искусство'},
    {key: 'business', label: 'Бизнес'},
    {key: 'design', label: 'Дизайн'},
    {key: 'health', label: 'Здоровье'},
    {key: 'it', label: 'IT и разработка'},
    {key: 'career', label: 'Карьера и работа'},
    {key: 'beauty', label: 'Красота и уход'},
    {key: 'crypto', label: 'Криптовалюта'},
    {key: 'culture', label: 'Культура'},
    {key: 'marketing', label: 'Маркетинг'},
    {key: 'medicine', label: 'Медицина'},
    {key: 'memes', label: 'Мемы и юмор'},
    {key: 'fashion', label: 'Мода'},
    {key: 'realty', label: 'Недвижимость'},
    {key: 'news', label: 'Новости'},
    {key: 'education', label: 'Образование'},
    {key: 'food', label: 'Еда и кулинария'},
    {key: 'family', label: 'Семья и отношения'},
    {key: 'social', label: 'Социальные проекты'},
    {key: 'sports', label: 'Спорт'},
    {key: 'tech', label: 'Технологии'},
    {key: 'travel', label: 'Туризм и путешествия'},
    {key: 'finance', label: 'Финансы'},
    {key: 'ecommerce', label: 'E-commerce'},
];

const ALL_SOURCES = [
    {key: 'instagram', label: 'Instagram'},
    {key: 'tiktok', label: 'Вирусное в TikTok'},
    {key: 'youtube', label: 'YouTube'},
    {key: 'twitter', label: 'Тренды X/Twitter'},
    {key: 'news', label: 'Главные новости'},
];

const ALL_REGIONS = [
    {key: 'global', label: 'Глобальные тренды'},
    {key: 'cis', label: 'СНГ'},
    {key: 'kz', label: 'Казахстан'},
    {key: 'ua', label: 'Украина'},
    {key: 'az', label: 'Азербайджан'},
    {key: 'uz', label: 'Узбекистан'},
];

// Icons for social platforms
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);
  
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const PlatformStatCard: React.FC<{ icon: React.ReactNode; platformName: string; postCount: string; theme: 'dark' | 'light', iconClassName?: string }> = ({ icon, platformName, postCount, theme, iconClassName }) => (
    <div className={`rounded-xl p-4 flex flex-col items-center justify-center text-center border ${
        theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
        <div className={`w-8 h-8 mb-2 ${iconClassName}`}>{icon}</div>
        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{postCount}</p>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{platformName}</p>
    </div>
);

const TrendCard: React.FC<{ trend: Trend; onReadMore: (trend: Trend) => void; onCreate: (trend: Trend) => void; theme: 'dark' | 'light' }> = ({ trend, onReadMore, onCreate, theme }) => (
    <div className={`rounded-xl p-4 flex flex-col text-left transition-all duration-300 border ${
        theme === 'dark' 
        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
        : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
    }`}>
      <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{trend.title}</h4>
      <p className={`text-sm flex-grow mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{trend.summary}</p>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onReadMore(trend);
          }}
          className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Подробнее
        </button>
        <button 
          onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onCreate(trend);
          }}
          className={`flex items-center gap-2 text-sm font-bold transition-all bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-4 py-2 active:scale-95`}
        >
          <WandSparklesIcon className="w-4 h-4" />
          <span>Использовать</span>
        </button>
      </div>
    </div>
);


const SectionTitle: React.FC<{ children: React.ReactNode; theme: 'dark' | 'light' }> = ({ children, theme }) => (
    <h4 className={`font-bold text-xs uppercase tracking-wider mb-2 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{children}</h4>
);

const TrendSettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    // Topics
    allTopics: {key: string; label: string}[];
    selectedTopics: string[];
    onToggleTopic: (topicKey: string) => void;
    customTopicInput: string;
    onCustomTopicInputChange: (value: string) => void;
    onAddCustomTopic: () => void;
    // Sources
    allSources: typeof ALL_SOURCES;
    selectedSources: string[];
    onToggleSource: (sourceKey: string) => void;
    // Regions
    allRegions: typeof ALL_REGIONS;
    selectedRegions: string[];
    onToggleRegion: (regionKey: string) => void;
    theme: 'dark' | 'light';
}> = ({ 
    isOpen, onClose, 
    allTopics, selectedTopics, onToggleTopic,
    customTopicInput, onCustomTopicInputChange, onAddCustomTopic,
    allSources, selectedSources, onToggleSource,
    allRegions, selectedRegions, onToggleRegion,
    theme,
}) => {
    if (!isOpen) return null;
    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className={`w-full max-w-lg flex flex-col shadow-2xl rounded-2xl border ${
                    theme === 'dark' 
                    ? 'backdrop-blur-xl bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                    <h3 className={`font-bebas text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Настройка трендов</h3>
                    <button onClick={onClose} className={`p-2 -m-2 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Закрыть">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-4 custom-scrollbar overflow-y-auto">
                    {/* Topics */}
                    <div>
                        <SectionTitle theme={theme}>Темы и Ниши</SectionTitle>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {allTopics.map(topic => (
                                <button
                                    key={topic.key}
                                    onClick={() => onToggleTopic(topic.key)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 border-2 ${selectedTopics.includes(topic.key) ? 'bg-purple-500 text-white border-purple-500' : `${theme === 'dark' ? 'bg-white/10 text-gray-300 border-transparent hover:border-gray-500' : 'bg-gray-100 text-gray-700 border-transparent hover:border-gray-400'}`}`}
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                        <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTopicInput}
                                    onChange={(e) => onCustomTopicInputChange(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddCustomTopic(); } }}
                                    placeholder="+ Свой вариант темы"
                                    className={`flex-grow border rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${theme === 'dark' ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                                />
                                <button
                                    onClick={onAddCustomTopic}
                                    className="px-3.5 py-1.5 text-lg font-bold rounded-lg transition-all duration-200 bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!customTopicInput.trim()}
                                    aria-label="Добавить свою тему"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sources */}
                    <div>
                        <SectionTitle theme={theme}>Источники</SectionTitle>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {allSources.map(source => (
                                <button
                                    key={source.key}
                                    onClick={() => onToggleSource(source.key)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 border-2 ${selectedSources.includes(source.key) ? 'bg-purple-500 text-white border-purple-500' : `${theme === 'dark' ? 'bg-white/10 text-gray-300 border-transparent hover:border-gray-500' : 'bg-gray-100 text-gray-700 border-transparent hover:border-gray-400'}`}`}
                                >
                                    {source.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Regions */}
                    <div>
                        <SectionTitle theme={theme}>Регион</SectionTitle>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {allRegions.map(region => (
                                <button
                                    key={region.key}
                                    onClick={() => onToggleRegion(region.key)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 border-2 ${selectedRegions.includes(region.key) ? 'bg-purple-500 text-white border-purple-500' : `${theme === 'dark' ? 'bg-white/10 text-gray-300 border-transparent hover:border-gray-500' : 'bg-gray-100 text-gray-700 border-transparent hover:border-gray-400'}`}`}
                                >
                                    {region.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}>
                    <GradientButton onClick={onClose} className="w-full justify-center px-4 py-2 text-sm">
                        Сохранить
                    </GradientButton>
                </div>
            </div>
        </div>
    );
};

const TrendDetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    trend: Trend | null;
    onUseIdea: (idea: string) => void;
    theme: 'dark' | 'light';
}> = ({ isOpen, onClose, trend, onUseIdea, theme }) => {
    if (!isOpen || !trend) return null;

    const handleUseIdea = () => {
        onUseIdea(`${trend.title}. ${trend.full_text}`);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className={`p-6 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl rounded-2xl border ${
                    theme === 'dark' 
                    ? 'backdrop-blur-xl bg-white/5 border-white/10' 
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{trend.source}</span>
                        <h3 className={`font-bebas text-3xl mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{trend.title}</h3>
                    </div>
                    <button onClick={onClose} className={`p-2 -mr-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                <div className="overflow-y-auto pr-2 -mr-4 mb-6 custom-scrollbar">
                    <p className={`leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{trend.full_text}</p>
                </div>

                <div className="mt-auto">
                     <GradientButton onClick={handleUseIdea} className="w-full justify-center">
                        <WandSparklesIcon className="w-6 h-6 mr-2"/>
                        Использовать эту идею
                    </GradientButton>
                </div>
            </div>
        </div>
    );
};

interface MainDashboardScreenProps {
  onNavigate: (screen: Screen, initialIdea?: string) => void;
  theme: 'dark' | 'light';
}

const MainDashboardScreen: React.FC<MainDashboardScreenProps> = ({ onNavigate, theme }) => {
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['tech', 'marketing']);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customTopics, setCustomTopics] = useState<{key: string; label: string}[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['instagram', 'tiktok']);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['kz', 'global']);
  const [trendToShow, setTrendToShow] = useState<Trend | null>(null);

  const allDisplayTopics = useMemo(() => [...customTopics, ...ALL_TOPICS], [customTopics]);

  const handleToggleTopic = (topicKey: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicKey)
        ? (prev.length > 1 ? prev.filter(t => t !== topicKey) : prev) // Prevent removing the last one
        : [...prev, topicKey]
    );
  };
  
  const handleAddCustomTopic = () => {
    const trimmedInput = customTopicInput.trim();
    if (trimmedInput && !allDisplayTopics.some(t => t.label.toLowerCase() === trimmedInput.toLowerCase())) {
        const newTopic = {
            key: `custom-${trimmedInput.toLowerCase().replace(/[^a-z0-9а-яё\s-]/g, '').replace(/\s+/g, '-')}`,
            label: trimmedInput
        };
        setCustomTopics(prev => [newTopic, ...prev]);
        if (!selectedTopics.includes(newTopic.key)) {
            setSelectedTopics(prev => [...prev, newTopic.key]);
        }
        setCustomTopicInput('');
    }
  };

  const handleToggleSource = (sourceKey: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceKey)
        ? (prev.length > 1 ? prev.filter(s => s !== sourceKey) : prev)
        : [...prev, sourceKey]
    );
  };
  
  const handleToggleRegion = (regionKey: string) => {
    setSelectedRegions(prev => 
      prev.includes(regionKey)
        ? (prev.length > 1 ? prev.filter(r => r !== regionKey) : prev)
        : [...prev, regionKey]
    );
  };
  
  const handleUseIdea = (trend: Trend) => {
      onNavigate(Screen.AiGeneration, `${trend.title}. ${trend.summary}`);
  }

  const trends = useMemo(() => {
    // Filter mock trends by selected topic keys, ignoring custom ones for now as they won't have mock data.
    return selectedTopics
        .filter(topicKey => !topicKey.startsWith('custom-'))
        .flatMap(topic => MOCK_TRENDS[topic] || []);
  }, [selectedTopics]);

  return (
    <>
      <div className="w-full h-full overflow-hidden max-w-lg mx-auto p-4 sm:p-6 flex flex-col">
        <header className="text-center">
            <h2 className="font-bebas text-6xl sm:text-7xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent">MOVE</h2>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Ваш AI-генератор контента</p>
        </header>

        <main className="flex-1 overflow-y-auto pt-4 pb-24 -mr-4 pr-4 custom-scrollbar">
          <section className="my-6">
            <div className="grid grid-cols-3 gap-3">
                <PlatformStatCard icon={<InstagramIcon />} platformName="Посты в Instagram" postCount="5" theme={theme} iconClassName="text-pink-400"/>
                <PlatformStatCard icon={<LinkedinIcon />} platformName="Посты в LinkedIn" postCount="2" theme={theme} iconClassName="text-blue-400" />
                <PlatformStatCard icon={<ClockIcon />} platformName="Часов сэкономлено" postCount="12" theme={theme} iconClassName="text-green-400"/>
            </div>
          </section>

          <section className="my-6">
            <GradientButton 
                onClick={() => onNavigate(Screen.AiGeneration)} 
                className="w-full justify-center !py-4 text-lg"
                icon={<WandSparklesIcon className="w-5 h-5"/>}
            >
                Сгенерировать новый пост
            </GradientButton>
          </section>

          <section className="my-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Что в тренде?</h3>
                <button onClick={() => setIsTopicModalOpen(true)} className={`text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-purple-400 hover:text-white' : 'text-purple-600 hover:text-purple-800'}`}>
                    Настроить
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {trends.map((trend, index) => (
                    <TrendCard 
                        key={trend.title} 
                        trend={trend}
                        onReadMore={setTrendToShow}
                        onCreate={handleUseIdea}
                        theme={theme}
                    />
                ))}
            </div>
          </section>
        </main>

        <BottomNavBar activeScreen={Screen.Dashboard} onNavigate={onNavigate} theme={theme} />
      </div>
      <TrendSettingsModal 
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        allTopics={allDisplayTopics}
        selectedTopics={selectedTopics}
        onToggleTopic={handleToggleTopic}
        customTopicInput={customTopicInput}
        onCustomTopicInputChange={setCustomTopicInput}
        onAddCustomTopic={handleAddCustomTopic}
        allSources={ALL_SOURCES}
        selectedSources={selectedSources}
        onToggleSource={handleToggleSource}
        allRegions={ALL_REGIONS}
        selectedRegions={selectedRegions}
        onToggleRegion={handleToggleRegion}
        theme={theme}
      />
       <TrendDetailModal 
          isOpen={!!trendToShow}
          onClose={() => setTrendToShow(null)}
          trend={trendToShow}
          onUseIdea={(idea) => onNavigate(Screen.AiGeneration, idea)}
          theme={theme}
      />
    </>
  );
};

export default MainDashboardScreen;