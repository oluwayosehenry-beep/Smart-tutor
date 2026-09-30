import { InteractiveLesson, QuizSet, PracticeProblem, ChatMessage, StudentLevel, ExamType } from '../types';
import { SAMPLE_DEFAULT_LESSON, SAMPLE_DEFAULT_QUIZ } from '../data/curriculum';

export async function checkServerStatus(): Promise<{ status: string; hasApiKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err) {
    console.warn('Server status check fallback:', err);
    return { status: 'offline', hasApiKey: false, model: 'gemini-3.8-flash' };
  }
}

export async function sendChatMessage(params: {
  messages: ChatMessage[];
  studentLevel: StudentLevel;
  subject: string;
  topic: string;
  examMode: ExamType;
  actionType?: 'normal' | 'simpler' | 'example' | 'quiz' | 'hint' | 'step-by-step';
}): Promise<{ reply: string; source: 'gemini' | 'curriculum-engine' }> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || 'I am ready to help you learn! What topic would you like to explore?',
      source: data.source || 'curriculum-engine',
    };
  } catch (err) {
    console.warn('Chat request failed, providing pedagogical fallback:', err);
    return {
      reply: `Let's tackle **${params.topic || params.subject}** together! 

Here is how we can think about this:
1. **Identify the core rule**: Every concept in ${params.subject} is built on simple building blocks.
2. **Break it down**: Isolate what is given from what we need to calculate or explain.
3. **Practice**: Would you like a step-by-step example, a simpler analogy, or a quick practice question?`,
      source: 'curriculum-engine',
    };
  }
}

export async function generateInteractiveLesson(params: {
  subject: string;
  topic: string;
  studentLevel: StudentLevel;
  examType: ExamType;
}): Promise<InteractiveLesson> {
  try {
    const res = await fetch('/api/gemini/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Lesson API returned ${res.status}`);
    const data = await res.json();
    if (data.lesson && data.lesson.objectives && data.lesson.explanation) {
      return data.lesson;
    }
    throw new Error('Invalid lesson structure');
  } catch (err) {
    console.warn('Lesson API error, using curriculum template:', err);
    // Return adapted default lesson
    return {
      ...SAMPLE_DEFAULT_LESSON,
      title: `${params.topic}: Structured Step-by-Step Mastery`,
      subject: params.subject,
      level: params.studentLevel,
    };
  }
}

export async function generateQuiz(params: {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
  examType: ExamType;
}): Promise<QuizSet> {
  try {
    const res = await fetch('/api/gemini/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Quiz API returned ${res.status}`);
    const data = await res.json();
    if (data.quiz && data.quiz.questions && Array.isArray(data.quiz.questions)) {
      return data.quiz;
    }
    throw new Error('Invalid quiz response');
  } catch (err) {
    console.warn('Quiz API error, using curriculum set:', err);
    return {
      ...SAMPLE_DEFAULT_QUIZ,
      title: `${params.subject}: ${params.topic} Assessment`,
      difficulty: params.difficulty,
      examType: params.examType,
    };
  }
}

export async function generatePracticeDrill(params: {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
  examType: ExamType;
}): Promise<PracticeProblem[]> {
  try {
    const res = await fetch('/api/gemini/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`Practice API returned ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.practice) && data.practice.length > 0) {
      return data.practice;
    }
    throw new Error('Invalid practice payload');
  } catch (err) {
    console.warn('Practice API error, providing template drill:', err);
    return [
      {
        id: 1,
        title: `${params.topic} Guided Problem #1`,
        question: `In ${params.subject}, solve a typical ${params.difficulty} difficulty problem on "${params.topic}". If base quantity is 20 and factor is 3, what is the resulting magnitude?`,
        hints: [
          'Recall standard definition for this concept.',
          'Multiply base quantity by the scale factor.',
        ],
        options: ['A) 60', 'B) 23', 'C) 17', 'D) 6.67'],
        correctIndex: 0,
        stepByStepSolution: [
          'Step 1: Write down given values (Base = 20, Factor = 3).',
          'Step 2: Apply formula: Result = Base × Factor.',
          'Step 3: 20 × 3 = 60.',
        ],
        keyTakeaway: 'Always identify given variables before executing algebraic steps.',
      },
      {
        id: 2,
        title: `${params.topic} Concept Verification #2`,
        question: `When dealing with "${params.topic}" under ${params.examType} examination criteria, what is the best strategy?`,
        hints: [
          'Consider step-by-step clarity vs skipping lines.',
        ],
        options: [
          'A) Show every substitution step to secure full method marks',
          'B) Only write the final number with no working',
          'C) Erase all rough work completely',
          'D) Guess without reading the prompt',
        ],
        correctIndex: 0,
        stepByStepSolution: [
          'Step 1: Exam marking schemes allot distinct marks for formula recall, numerical substitution, and unit accuracy.',
          'Step 2: Showing intermediate calculations prevents total zero if an arithmetic slip occurs at the end.',
        ],
        keyTakeaway: 'Method marks account for over 60% of total score in STEM examinations.',
      },
    ];
  }
}
