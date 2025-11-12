import React from 'react';
import { SlideData, Template } from '../types';

interface SlideProps {
  data: SlideData;
  slideNumber: number;
  totalSlides: number;
  template: Template;
}

const HighlightedContent: React.FC<{ content: string; keywords: string[]; highlightClass: string }> = ({ content, keywords, highlightClass }) => {
  if (!keywords || keywords.length === 0) {
    return <p>{content}</p>;
  }
  
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = content.split(regex);

  return (
    <p>
      {parts.map((part, i) =>
        keywords.some(keyword => new RegExp(`^${keyword}$`, 'i').test(part)) ? (
          <span key={i} className="relative inline-block">
            <span className="relative z-10">{part}</span>
            <span className={`absolute -left-1 -right-1 -bottom-0.5 top-1/2 h-1/2 transform z-0 transition-all duration-300 ${highlightClass}`}></span>
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};


const Slide: React.FC<SlideProps> = ({ data, slideNumber, totalSlides, template }) => {
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(data.image_prompt)}/1080/1080`;
  
  const templateStyles = {
    DEFAULT: {
      container: 'border-transparent',
      title: 'font-bebas text-5xl md:text-7xl lg:text-8xl',
      contentContainer: 'text-lg md:text-xl lg:text-2xl',
      highlight: 'bg-purple-500/50 -skew-x-12'
    },
    MINIMAL: {
      container: 'border-white/20',
      title: 'font-sans font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter',
      contentContainer: 'text-md md:text-lg lg:text-xl font-light',
      highlight: 'bg-white/20'
    },
    BRUTAL: {
      container: 'border-red-500',
      title: 'font-mono uppercase font-black text-5xl md:text-7xl lg:text-8xl text-red-500',
      contentContainer: 'text-lg md:text-xl lg:text-2xl font-mono bg-black p-2',
      highlight: 'bg-red-500 text-black'
    },
    GRADIENT: {
      container: 'border-purple-500/50',
      title: 'font-bebas text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text',
      contentContainer: 'text-lg md:text-xl lg:text-2xl',
      highlight: 'bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70'
    },
    COMIC: {
      container: 'border-yellow-400 border-4',
      title: 'font-bebas text-6xl md:text-8xl lg:text-9xl text-yellow-400 [text-shadow:3px_3px_0_#000]',
      contentContainer: 'text-xl md:text-2xl lg:text-3xl font-bold',
      highlight: 'bg-blue-500 text-white skew-y-[-3deg]'
    }
  };

  const styles = templateStyles[template] || templateStyles.DEFAULT;

  return (
    <div className={`w-full h-full bg-black rounded-2xl overflow-hidden relative flex flex-col justify-between p-8 md:p-12 text-white shadow-2xl shadow-purple-500/10 border-2 transition-all duration-300 ${styles.container}`}>
      <img src={imageUrl} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
      
      <header className="relative z-20 flex justify-between items-center">
        <span className="font-bold text-sm bg-white/10 px-3 py-1 rounded-full">@ваш_аккаунт</span>
        <span className="font-mono text-sm">{`${slideNumber}/${totalSlides}`}</span>
      </header>

      <main className="relative z-20 flex-grow flex flex-col justify-center text-center">
        <h2 className={`tracking-wide mb-6 transition-all duration-300 ${styles.title}`}>{data.title}</h2>
        <div className={`max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${styles.contentContainer}`}>
           <HighlightedContent content={data.content} keywords={data.highlight_keywords} highlightClass={styles.highlight} />
        </div>
      </main>
      
      <footer className="relative z-20 text-center">
         <h3 className="font-bebas text-2xl tracking-widest text-white/50">MOVE</h3>
      </footer>
    </div>
  );
};

export default Slide;