import React, { useState, useMemo, useRef } from 'react';
import { Screen, Project, CarouselData, ContentType } from '../types';
import BottomNavBar from '../components/BottomNavBar';
import { SearchIcon, LayersIcon, Trash2Icon, XIcon } from '../constants';

const mockCarouselData1: CarouselData = [{"title":"Новая Волна Контента","content":"MOVE переосмысливает то, как мы создаем. Это не о задачах, а об инсайтах. Мгновенно, эффектно и интеллектуально.","highlight_keywords":["MOVE","инсайтах","Мгновенно"],"image_prompt":"Футуристическая неоновая волна, протекающая через темную, абстрактную городскую сетку, представляющая данные и идеи в движении."},{"title":"Скорость и Интуиция","content":"Зачем ждать, пока вдохновение обработается? Говорите, что думаете, и наблюдайте, как это за секунды становится потрясающим постом.","highlight_keywords":["Говорите, что думаете","потрясающим постом"],"image_prompt":"Стилизованный человеческий силуэт, от которого исходят звуковые волны, превращающиеся в красочные геометрические фигуры и световые шлейфы."},{"title":"Твой Стиль, Усиленный","content":"Выбирайте из дерзких шаблонов, настраивайте каждую деталь и автоматически поддерживайте свой уникальный голос бренда на всех платформах.","highlight_keywords":["дерзких шаблонов","голос бренда"],"image_prompt":"Динамичный взрыв цветов и стилей шрифтов с центральным, светящимся логотипом, представляющим личный бренд."}];
const mockCarouselData2: CarouselData = [{"title":"Стратегия Роста Q3","content":"Фокусируемся на трех ключевых направлениях: удержание клиентов, выход на новые рынки и оптимизация воронки продаж.","highlight_keywords":["удержание","новые рынки","оптимизация"],"image_prompt":"Абстрактная диаграмма роста с тремя расходящимися стрелками, каждая из которых имеет свой уникальный цветовой код и текстуру."},{"title":"Анализ Конкурентов","content":"Главные конкуренты усиливают позиции в социальных сетях. Наш ответ — более качественный и нишевый контент.","highlight_keywords":["Конкуренты","качественный контент"],"image_prompt":"Стилизованная шахматная доска с фигурами, представляющими компании, одна фигура излучает яркий свет."}];
const mockCarouselData3: CarouselData = [{"title":"Презентация для Инвесторов","content":"Наш продукт решает реальную проблему для 10 миллионов пользователей. Прогнозируемый рост — 300% в следующем году.","highlight_keywords":["10 миллионов","рост 300%"],"image_prompt":"Восходящая экспоненциальная кривая, состоящая из светящихся частиц, на темном фоне с элементами пользовательского интерфейса."}];


const initialProjects: Project[] = [
    { id: 'proj1', name: 'Новая Волна Контента', lastModified: '2 дня назад', slidesCount: 3, data: mockCarouselData1, thumbnailUrl: `https://picsum.photos/seed/proj1/400/400`, format: 'carousel' },
    { id: 'proj2', name: 'Маркетинговая Стратегия Q3', lastModified: '5 дней назад', slidesCount: 2, data: mockCarouselData2, thumbnailUrl: `https://picsum.photos/seed/proj2/400/400`, format: 'stories' },
    { id: 'proj3', name: 'Презентация для инвесторов', lastModified: '1 неделю назад', slidesCount: 1, data: mockCarouselData3, thumbnailUrl: `https://picsum.photos/seed/proj3/400/400`, format: 'post' },
    { id: 'proj4', name: 'Идеи для социальных сетей', lastModified: '2 недели назад', slidesCount: 5, data: mockCarouselData1, thumbnailUrl: `https://picsum.photos/seed/proj4/400/400`, format: 'threads' },
    { id: 'proj5', name: 'Анализ конкурентов', lastModified: '1 месяц назад', slidesCount: 7, data: mockCarouselData2, thumbnailUrl: `https://picsum.photos/seed/proj5/400/400`, format: 'carousel' },
];

const formatLabels: Record<ContentType, string> = {
    carousel: 'Карусель',
    post: 'Пост',
    stories: 'Stories',
    reels: 'Reels',
    threads: 'Threads',
    newsletter: 'Рассылка',
};

const ProjectCard: React.FC<{
    project: Project;
    onDelete: () => void;
    onClick: () => void;
    theme: 'dark' | 'light';
}> = ({ project, onDelete, onClick, theme }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const hasDraggedRef = useRef(false);

    const SWIPE_TO_DELETE_THRESHOLD = -80; // How far to swipe to trigger delete

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        dragStartXRef.current = e.clientX;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current || !cardRef.current) return;

        const diff = e.clientX - dragStartXRef.current;
        
        if (Math.abs(diff) > 5) { // Threshold to differentiate click and drag
            hasDraggedRef.current = true;
        }

        // Only allow left swipe
        if (diff > 0) {
             cardRef.current.style.transform = `translateX(0px)`;
             return;
        }
        
        cardRef.current.style.transform = `translateX(${diff}px)`;
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        const cardElement = cardRef.current;
        if (!cardElement) return;
        
        const currentTransform = new DOMMatrix(getComputedStyle(cardElement).transform).m41;

        if (currentTransform < SWIPE_TO_DELETE_THRESHOLD) {
            onDelete();
        }
        
        // Always snap back
        cardElement.style.transition = 'transform 0.3s ease';
        cardElement.style.transform = 'translateX(0px)';
    };
    
    const handleCardClick = () => {
        if (!hasDraggedRef.current) {
            onClick();
        }
    };

    return (
        <div
            ref={cardRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handleCardClick}
            className={`rounded-xl flex items-center group relative cursor-pointer p-3 gap-4 touch-pan-y transition-colors border ${
                theme === 'dark'
                ? 'backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:bg-gray-50 shadow-md'
            }`}
            style={{ willChange: 'transform' }}
        >
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-black rounded-lg overflow-hidden relative">
                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">{formatLabels[project.format]}</div>
            </div>
            <div className="flex-grow flex flex-col justify-between self-stretch py-1 min-w-0">
                <div>
                    <h3 className={`font-bold text-base truncate group-hover:text-purple-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.name}</h3>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{project.lastModified}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <LayersIcon className="w-3 h-3"/>
                    <span>{project.slidesCount} слайдов</span>
                </div>
            </div>
        </div>
    );
};

const ActionModal: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClose: () => void; theme: 'dark' | 'light'}> = ({ title, children, isOpen, onClose, theme }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`rounded-2xl p-6 w-full max-w-sm shadow-2xl border ${theme === 'dark' ? 'backdrop-blur-xl bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bebas text-3xl text-center mb-6">{title}</h3>
                {children}
            </div>
        </div>
    );
};

interface ProjectsScreenProps {
  onNavigate: (screen: Screen) => void;
  onEditProject: (project: Project) => void;
  theme: 'dark' | 'light';
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onNavigate, onEditProject, theme }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = useMemo(() =>
    projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [projects, searchQuery]
  );
  
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    }
    setProjectToDelete(null);
  };

  return (
    <>
      <div className="w-full h-full overflow-hidden max-w-lg mx-auto p-4 sm:p-6 flex flex-col">
        <header className="flex-shrink-0">
          <div style={{ perspective: '1000px' }}>
            <h2 className="font-bebas text-6xl sm:text-7xl tracking-widest bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent transition-transform duration-500 ease-in-out hover:[transform:rotateX(15deg)_rotateY(-20deg)] [transform-style:preserve-3d]">MOVE</h2>
          </div>
          <div className="relative mt-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
            <input
              type="text"
              placeholder="Найти проект..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl py-3 pl-12 pr-4 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border ${
                  theme === 'dark' 
                  ? 'backdrop-blur-xl bg-white/5 border-white/10 text-white' 
                  : 'bg-white border-gray-200 text-gray-900 shadow-sm'
              }`}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto py-6 -mr-4 pr-4 custom-scrollbar">
            <div className="space-y-4">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onDelete={() => setProjectToDelete(project)} 
                            onClick={() => onEditProject(project)}
                            theme={theme}
                        />
                    ))
                ) : (
                    <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <LayersIcon className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Проектов не найдено</h3>
                        <p className="mt-1">Попробуйте изменить поисковый запрос или создайте новый проект.</p>
                    </div>
                )}
            </div>
        </main>
      </div>

      <ActionModal title="Подтвердите удаление" isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} theme={theme}>
        <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Вы уверены, что хотите удалить проект "{projectToDelete?.name}"? Это действие нельзя будет отменить.</p>
        <div className="flex gap-3">
          <button onClick={() => setProjectToDelete(null)} className={`w-full font-bold py-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Отмена</button>
          <button onClick={handleConfirmDelete} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">Удалить</button>
        </div>
      </ActionModal>

      <BottomNavBar activeScreen={Screen.Projects} onNavigate={onNavigate} theme={theme} />
    </>
  );
};

export default ProjectsScreen;