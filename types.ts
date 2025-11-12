export enum Screen {
  Welcome,
  Dashboard,
  AiGeneration,
  ContentTypeSelection,
  Editor,
  TextPost,
  Projects,
  Settings,
  Threads,
  Newsletter,
  Reels,
}

export type ContentType = 'carousel' | 'post' | 'stories' | 'reels' | 'threads' | 'newsletter';

export interface SlideData {
  title: string;
  content: string;
  highlight_keywords: string[];
  image_prompt: string;
}

export type CarouselData = SlideData[];

export type Template = 'DEFAULT' | 'MINIMAL' | 'BRUTAL' | 'GRADIENT' | 'COMIC';

export interface Project {
  id: string;
  name: string;
  lastModified: string;
  slidesCount: number;
  thumbnailUrl: string;
  data: CarouselData;
  format: ContentType;
}