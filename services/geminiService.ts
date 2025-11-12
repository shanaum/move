import { GoogleGenAI, Type } from "@google/genai";
import { CarouselData } from '../types';

// Запасные данные на случай ошибки API
const fallbackData: CarouselData = [
    {
      title: "Ошибка Генерации",
      content: "Не удалось связаться с AI. Пожалуйста, проверьте ваше подключение или API-ключ и попробуйте снова.",
      highlight_keywords: ["Ошибка", "API-ключ"],
      image_prompt: "Абстрактный глитч-арт, символизирующий ошибку соединения с нейросетью, в красных и черных тонах."
    },
    {
      title: "Что-то пошло не так",
      content: "Искусственный интеллект сейчас не в настроении творить. Возможно, он пьет свой цифровой кофе.",
      highlight_keywords: ["не в настроении", "кофе"],
      image_prompt: "Милый робот, сидящий за столом с чашкой кофе, от которой идет пар в виде двоичного кода."
    }
];


const carouselSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "Очень короткий, броский заголовок для слайда (идеально 3-5 слов, максимум 8 слов). Для первого слайда - самый ударный."
            },
            content: {
                type: Type.STRING,
                description: "Основной текст слайда. 1-2 коротких предложения (максимум 30 слов). Должен быть лаконичным и четким. Для первого слайда-обложки может быть коротким подзаголовком или пустым."
            },
            highlight_keywords: {
                type: Type.ARRAY,
                description: "Список из 1-3 ключевых слов или коротких фраз из контента для визуального выделения.",
                items: { type: Type.STRING }
            },
            image_prompt: {
                type: Type.STRING,
                description: "Подробный промпт для DALL-E или Midjourney для создания потрясающего, абстрактного и современного фонового изображения, которое визуализирует основную идею слайда."
            }
        },
        required: ["title", "content", "highlight_keywords", "image_prompt"]
    }
};

const toneInstructions: { [key: string]: string } = {
    daring: "Тон должен быть дерзким, современным и вдохновляющим.",
    professional: "Используй строгий, деловой и убедительный тон, подходящий для LinkedIn.",
    provocative: "Создай провокационный и заставляющий задуматься контент, который вызывает дискуссию.",
    inspirational: "Тон должен быть мотивирующим, позитивным и вдохновляющим на действия.",
    witty: "Используй остроумный, ироничный и умный юмор.",
    minimalistic: "Текст должен быть предельно лаконичным, ясным и минималистичным.",
    empathetic: "Говори с аудиторией на языке эмпатии, понимания и поддержки.",
    energetic: "Тон должен быть энергичным, динамичным и полным энтузиазма.",
};


export const generateCarouselContent = async (idea: string, tone: string): Promise<CarouselData> => {
    if (!process.env.API_KEY) {
        console.error("API-ключ Gemini не найден. Пожалуйста, установите переменную окружения API_KEY.");
        return fallbackData;
    }
  
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const toneInstruction = toneInstructions[tone] || toneInstructions['daring'];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `На основе этой сырой идеи: "${idea}", создай контент для карусели в социальных сетях. ${toneInstruction} Строго следуй правилам из системной инструкции.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: carouselSchema,
                systemInstruction: `Ты — ИИ-креативный директор в SMM-агентстве MOVE. Твоя задача — превращать сырые идеи в эффектные посты-карусели. Ты мыслишь визуально и структурно.

Твои правила — это закон:
1.  **Количество слайдов:** Если идея короткая, сделай 5-6 слайдов. Если идея длинная и подробная, сделай до 10 слайдов. НИКОГДА не превышай 10 слайдов.
2.  **Первый слайд — обложка.** Он должен иметь самый броский, мощный и короткий заголовок (3-5 слов), который цепляет внимание. Сопроводительный текст на первом слайде должен быть минимальным (подзаголовок) или отсутствовать.
3.  **Один слайд — одна мысль.** Каждый последующий слайд раскрывает один конкретный, логически завершенный аспект основной идеи. Не разрывай одну мысль на несколько слайдов.
4.  **Предельная лаконичность.** Заголовки — до 8 слов. Основной текст — 1-2 коротких предложения, до 30 слов. Текст должен идеально помещаться в блок, без переносов и "висячих строк".
5.  **Логическая структура.** Структурируй карусель как историю: введение (слайд 1), развитие (несколько слайдов), кульминация/вывод (последний слайд). Последний слайд может содержать призыв к действию.
6.  **Визуальные промпты.** Промпты для изображений должны быть яркими, абстрактными и соответствовать дерзкому стилю MOVE.`
            },
        });

        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);

        if (!Array.isArray(data) || data.length === 0) {
            console.error("ИИ вернул неверные или пустые данные:", data);
            return fallbackData;
        }
        
        return data as CarouselData;

    } catch (error) {
        console.error("Ошибка при генерации контента с помощью Gemini API:", error);
        return fallbackData;
    }
};


export const regeneratePost = async (originalPost: { title: string; body: string }, tone: string): Promise<CarouselData> => {
    if (!process.env.API_KEY) {
        console.error("API-ключ Gemini не найден. Пожалуйста, установите переменную окружения API_KEY.");
        return fallbackData;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const toneInstruction = toneInstructions[tone] || toneInstructions['daring'];

        const prompt = `Переделай этот текстовый пост в формат карусели. ${toneInstruction}.

Оригинальный пост:
---
Заголовок: ${originalPost.title}

${originalPost.body}
---

Твои задачи:
1.  Создай мощный заголовок для первого слайда-обложки (3-5 слов).
2.  Разбей ключевые мысли поста на отдельные слайды (1 мысль = 1 слайд).
3.  Сократи текст для каждого слайда до предела (заголовок до 8 слов, основной текст до 30 слов).
4.  Сгенерируй яркие визуальные промпты для каждого слайда.
5.  Верни результат в виде JSON-массива, соответствующего схеме. Если контент короткий, сделай 5-6 слайдов, если длинный — до 10.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: carouselSchema,
                systemInstruction: "Ты — талантливый редактор в SMM-агентстве MOVE. Твоя задача — переформатировать существующий текст в динамичную и лаконичную карусель, соблюдая строгие правила визуального контента. Строго следуй правилам: 1. Первый слайд - обложка с мощным заголовком. 2. Один слайд - одна мысль. 3. Текст предельно короткий."
            },
        });

        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);

        if (!Array.isArray(data) || data.length === 0) {
            console.error("ИИ вернул неверные или пустые данные для регенерации:", data);
            return fallbackData;
        }
        
        return data as CarouselData;

    } catch (error) {
        console.error("Ошибка при регенерации контента с помощью Gemini API:", error);
        const regenerationErrorData = [...fallbackData];
        regenerationErrorData[0].title = "Ошибка регенерации";
        return regenerationErrorData;
    }
};

const hashtagSchema = {
    type: Type.OBJECT,
    properties: {
        hashtags: {
            type: Type.ARRAY,
            description: "Список из 7-10 релевантных хештегов для поста в социальных сетях. Хештеги должны быть на русском языке, без символа #.",
            items: { type: Type.STRING }
        }
    },
    required: ["hashtags"]
};

export const generateHashtags = async (postText: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
        console.error("API-ключ Gemini не найден.");
        return ["ошибка_генерации"];
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Проанализируй следующий текст поста и сгенерируй для него список релевантных хештегов. Хештеги должны быть популярными, но при этом соответствовать теме поста.
---
${postText}
---`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: hashtagSchema,
                systemInstruction: "Ты — эксперт по SMM и SEO. Твоя задача — генерировать эффективные хештеги для постов в социальных сетях."
            },
        });

        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);

        if (data && Array.isArray(data.hashtags)) {
            return data.hashtags;
        }

        console.error("ИИ вернул неверный формат хештегов:", data);
        return ["неверный_формат"];
    } catch (error) {
        console.error("Ошибка при генерации хештегов:", error);
        return ["ошибка_api"];
    }
};