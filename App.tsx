import React, { useState, useCallback, useEffect } from 'react';
import { Screen, CarouselData, Project, ContentType } from './types';
import WelcomeScreen from './screens/WelcomeScreen';
import MainDashboardScreen from './screens/MainDashboardScreen';
import EditorScreen from './screens/CreationScreen';
import AiGenerationScreen from './screens/AiGenerationScreen';
import ContentTypeSelectionScreen from './screens/ContentTypeSelectionScreen';
import TextPostScreen from './screens/TextPostScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnimatedBackground from './components/AnimatedBackground';
import { regeneratePost } from './services/geminiService';
import ThreadsScreen from './screens/ThreadsScreen';
import NewsletterScreen from './screens/NewsletterScreen';
import ReelsScreen from './screens/ReelsScreen';

export type Theme = 'dark' | 'light';

export const AppContext = React.createContext<{ theme: Theme; toggleTheme: () => void; }>({
  theme: 'dark',
  toggleTheme: () => {},
});


const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [generationTone, setGenerationTone] = useState<string>('daring');
  const [initialIdeaForGenerator, setInitialIdeaForGenerator] = useState<string | undefined>(undefined);
  const [editorSource, setEditorSource] = useState<Screen>(Screen.Dashboard);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('carousel');

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as Theme) || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {
        console.error("Could not save theme to localStorage", e);
      }
      return newTheme;
    });
  }, []);

  useEffect(() => {
      const root = document.documentElement;
      if (theme === 'light') {
          root.classList.remove('dark');
      } else {
          root.classList.add('dark');
      }
  }, [theme]);


  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);
  
  const handleNavigation = (screen: Screen, initialIdea?: string) => {
    if (screen === Screen.AiGeneration) {
        setInitialIdeaForGenerator(initialIdea);
    }
    navigateTo(screen);
  };

  const handleContentGenerated = (data: CarouselData, tone: string) => {
    setCarouselData(data);
    setGenerationTone(tone);
    setEditorSource(Screen.AiGeneration);
    navigateTo(Screen.ContentTypeSelection);
  };

  const handleEditProject = (project: Project) => {
    setCarouselData(project.data);
    setEditorSource(Screen.Projects);
    setSelectedContentType('carousel'); // Old projects are square carousels
    navigateTo(Screen.Editor);
  };

  const handleRegeneratePost = async (postToRegenerate?: { title: string, body: string }) => {
    if (!carouselData && !postToRegenerate) return;
    
    try {
        const post = postToRegenerate || {
            title: carouselData![0].title,
            body: carouselData!.map(slide => `${slide.title}\n${slide.content}`).join('\n\n'),
        };

        const newData = await regeneratePost(post, generationTone);
        setCarouselData(newData);
    } catch (error) {
        console.error("Failed to regenerate post:", error);
    }
  };

  const handleContentTypeSelected = (contentType: string) => {
    const type = contentType as ContentType;
    setSelectedContentType(type);
    switch (type) {
      case 'post':
        navigateTo(Screen.TextPost);
        break;
      case 'threads':
        navigateTo(Screen.Threads);
        break;
      case 'newsletter':
        navigateTo(Screen.Newsletter);
        break;
      case 'reels':
        navigateTo(Screen.Reels);
        break;
      case 'carousel':
      case 'stories':
      default:
        navigateTo(Screen.Editor);
        break;
    }
  };
  
  const handleBackFromGenerator = () => {
    setInitialIdeaForGenerator(undefined);
    navigateTo(Screen.Dashboard);
  }

  const renderScreen = () => {
    const backFromEditor = editorSource === Screen.Projects ? Screen.Projects : Screen.ContentTypeSelection;
    switch (currentScreen) {
      case Screen.Welcome:
        return <WelcomeScreen onStart={() => navigateTo(Screen.Dashboard)} theme={theme} />;
      case Screen.Dashboard:
        return <MainDashboardScreen onNavigate={handleNavigation} theme={theme} />;
      case Screen.Projects:
        return <ProjectsScreen onNavigate={handleNavigation} onEditProject={handleEditProject} theme={theme} />;
      case Screen.Settings:
        return <SettingsScreen onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Screen.AiGeneration:
        return <AiGenerationScreen 
                    onContentGenerated={handleContentGenerated} 
                    onBack={handleBackFromGenerator} 
                    initialIdea={initialIdeaForGenerator} 
                    theme={theme}
                />;
      case Screen.ContentTypeSelection:
        return <ContentTypeSelectionScreen onSelect={handleContentTypeSelected} onBack={() => navigateTo(Screen.AiGeneration)} carouselData={carouselData} theme={theme} />;
      case Screen.Editor:
        return <EditorScreen onBack={() => navigateTo(backFromEditor)} carouselData={carouselData} onNavigate={navigateTo} contentType={selectedContentType} theme={theme} />;
      case Screen.TextPost:
        return <TextPostScreen 
          onBack={() => navigateTo(Screen.ContentTypeSelection)} 
          onRegenerate={handleRegeneratePost}
          carouselData={carouselData} 
          generationTone={generationTone}
          theme={theme}
        />;
      case Screen.Threads:
        return <ThreadsScreen 
          onBack={() => navigateTo(Screen.ContentTypeSelection)} 
          onRegenerate={handleRegeneratePost}
          carouselData={carouselData} 
          theme={theme}
        />;
      case Screen.Newsletter:
        return <NewsletterScreen
          onBack={() => navigateTo(Screen.ContentTypeSelection)} 
          onRegenerate={handleRegeneratePost}
          carouselData={carouselData} 
          theme={theme}
        />;
      case Screen.Reels:
        return <ReelsScreen onBack={() => navigateTo(Screen.ContentTypeSelection)} theme={theme} />;
      default:
        return <WelcomeScreen onStart={() => navigateTo(Screen.Dashboard)} theme={theme} />;
    }
  };

  return (
    <div className={`h-screen w-full overflow-hidden fixed inset-0 ${
      theme === 'dark' 
      ? 'bg-gradient-to-br from-[#0a0015] via-[#1a0a2e] to-black text-white' 
      : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
    }`}>
      {theme === 'dark' && <AnimatedBackground />}
      <main className="relative z-10 h-full w-full flex flex-col items-center justify-center p-0">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;