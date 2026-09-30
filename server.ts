import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize GoogleGenAI SDK with server-side environment key
// Always set User-Agent to 'aistudio-build' as required
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('GoogleGenAI initialized successfully with GEMINI_API_KEY');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
} else {
  console.warn('GEMINI_API_KEY not found in environment. Server will use intelligent educational fallbacks.');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Status
  app.get('/api/status', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey,
      model: 'gemini-3.8-flash',
      serverTime: new Date().toISOString(),
    });
  });

  // AI Tutor Chat Route
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        studentLevel = 'Senior Secondary School',
        subject = 'General',
        topic = '',
        examMode = 'None',
        actionType = 'normal', // 'simpler', 'example', 'quiz', 'hint', 'step-by-step', 'normal'
      } = req.body;

      const systemPrompt = `You are "SmartTutor AI", a world-class, patient, encouraging, and highly professional online personal tutor.
Your job is to help the student truly understand concepts rather than simply handing over final answers.

Student Context:
- Academic Level: ${studentLevel}
- Current Subject: ${subject}
- Focus Topic: ${topic || 'General learning'}
- Target Exam: ${examMode}
- Request Modifier: ${actionType}

Crucial Pedagogical Rules:
1. Explain in clear, simple language appropriate for ${studentLevel}.
2. Break complex ideas down into numbered or bulleted digestible steps.
3. Use concrete, relatable real-world examples (including culturally accessible ones for students, especially Nigerian context if ${examMode} is WAEC/NECO/JAMB).
4. Never insult, demean, or make the student feel embarrassed for asking questions or making mistakes.
5. If the student made an error, validate their effort, gently pinpoint where their thought process diverged, and guide them to the right path.
6. Give hints and ask reflective follow-up questions to check their comprehension ("Does this step make sense?" or "What do you think we should do next?").
7. Do not just complete their homework. Walk them through the underlying principles.
8. If asked for a simpler explanation, use metaphors and eliminate jargon.
9. Format math formulas neatly (e.g. x = (-b ± √(b² - 4ac)) / (2a)) and use bold headers for clarity.`;

      let promptInstruction = '';
      if (actionType === 'simpler') {
        promptInstruction = '\n[Student requested: Please explain the last concept in much simpler, everyday terms with an easy analogy.]';
      } else if (actionType === 'example') {
        promptInstruction = '\n[Student requested: Please give a clear, worked real-world example of this concept.]';
      } else if (actionType === 'quiz') {
        promptInstruction = '\n[Student requested: Please ask me 2 quick checkpoint questions to test if I really understood this.]';
      } else if (actionType === 'hint') {
        promptInstruction = '\n[Student requested: Please give me a small hint without spoiling the full solution.]';
      } else if (actionType === 'step-by-step') {
        promptInstruction = '\n[Student requested: Please break down the solution into clear, numbered steps.]';
      }

      // If Gemini API is available, try it
      if (ai) {
        try {
          const formattedHistory = messages
            .slice(-8)
            .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Student' : 'Tutor'}: ${m.text}`)
            .join('\n\n');

          const combinedPrompt = `${systemPrompt}\n\nConversation History:\n${formattedHistory}${promptInstruction}\n\nTutor:`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: combinedPrompt,
          });

          const reply = response.text || 'I am ready to help! Could you please restate your question?';
          return res.json({ reply, source: 'gemini' });
        } catch (geminiErr) {
          console.warn('Gemini generateContent temporary error (falling back to curriculum engine):', geminiErr);
        }
      }

      // Intelligent Pedagogical Fallback when API key is not present or Gemini experiences high demand
      const fallbackReply = generateFallbackTutorResponse({
        messages,
        studentLevel,
        subject,
        topic,
        examMode,
        actionType,
      });

      return res.json({ reply: fallbackReply, source: 'curriculum-engine' });
    } catch (err: any) {
      console.error('Error in /api/gemini/chat:', err);
      const fallbackReply = generateFallbackTutorResponse({
        messages: req.body?.messages || [],
        studentLevel: req.body?.studentLevel || 'Senior Secondary School',
        subject: req.body?.subject || 'General',
        topic: req.body?.topic || '',
        examMode: req.body?.examMode || 'None',
        actionType: req.body?.actionType || 'normal',
      });
      return res.json({ reply: fallbackReply, source: 'curriculum-engine' });
    }
  });

  // AI Interactive Lesson Generator
  app.post('/api/gemini/lesson', async (req: Request, res: Response) => {
    try {
      const {
        subject = 'Mathematics',
        topic = 'Quadratic Equations',
        studentLevel = 'Senior Secondary School',
        examType = 'WAEC',
      } = req.body;

      if (ai) {
        const prompt = `You are SmartTutor AI's Master Curriculum Designer.
Generate a comprehensive, highly engaging interactive lesson for:
Subject: ${subject}
Topic: ${topic}
Academic Level: ${studentLevel}
Target Exam Focus: ${examType}

You MUST respond strictly with valid JSON conforming to this schema (no markdown fences, just pure JSON):
{
  "title": "${topic}",
  "subject": "${subject}",
  "level": "${studentLevel}",
  "estimatedMinutes": 25,
  "objectives": ["string", "string", "string"],
  "introduction": "string (engaging hook, why this topic matters in real life)",
  "explanation": "string (clear, step-by-step conceptual breakdown with intuitive headings)",
  "workedExamples": [
    {
      "problem": "string",
      "stepByStepSolution": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
      "keyTakeaway": "string"
    }
  ],
  "interactiveQuestions": [
    {
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answerIndex": 0,
      "hint": "string",
      "explanation": "string"
    }
  ],
  "practiceExercises": [
    {
      "exercise": "string",
      "hint": "string",
      "solution": "string"
    }
  ],
  "shortQuiz": [
    {
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctIndex": 0,
      "explanation": "string"
    }
  ],
  "summary": ["Key point 1", "Key point 2", "Key point 3"],
  "homework": [
    {
      "task": "string",
      "guidance": "string"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '{}';
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const lessonData = JSON.parse(cleaned);
        return res.json({ lesson: lessonData, source: 'gemini' });
      }

      // Fallback structured lesson
      const fallbackLesson = generateFallbackLesson(subject, topic, studentLevel, examType);
      return res.json({ lesson: fallbackLesson, source: 'curriculum-engine' });
    } catch (err: any) {
      console.error('Error in /api/gemini/lesson:', err);
      // Return guaranteed fallback lesson so UI never breaks
      const fallbackLesson = generateFallbackLesson(
        req.body?.subject || 'Mathematics',
        req.body?.topic || 'Algebra',
        req.body?.studentLevel || 'Senior Secondary School',
        req.body?.examType || 'General'
      );
      return res.json({ lesson: fallbackLesson, source: 'fallback', note: err?.message });
    }
  });

  // AI Quiz Generator
  app.post('/api/gemini/quiz', async (req: Request, res: Response) => {
    try {
      const {
        subject = 'Mathematics',
        topic = 'Algebra',
        difficulty = 'Medium',
        count = 5,
        examType = 'JAMB',
      } = req.body;

      if (ai) {
        const prompt = `Generate a ${count}-question quiz on ${subject}: "${topic}".
Difficulty: ${difficulty}.
Target Exam Syllabus: ${examType} (e.g., WAEC, JAMB, NECO, General).
Include a balanced mix of:
- Multiple choice questions (mcq)
- True/False questions (tf)
- Short conceptual answer questions (short)

Respond STRICTLY with valid JSON conforming to this schema (no markdown, just JSON):
{
  "title": "${subject} - ${topic} Mastery Quiz",
  "difficulty": "${difficulty}",
  "timeLimitMinutes": ${Math.max(5, count * 2)},
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": 0,
      "hint": "string",
      "explanation": "Detailed explanation of why this answer is correct."
    },
    {
      "id": 2,
      "type": "tf",
      "question": "Statement...",
      "options": ["True", "False"],
      "correctAnswer": 0,
      "hint": "string",
      "explanation": "Explanation..."
    },
    {
      "id": 3,
      "type": "short",
      "question": "Calculate or explain...",
      "correctAnswer": "Exact or keyword answer",
      "hint": "string",
      "explanation": "Detailed step-by-step solution..."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '{}';
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const quizData = JSON.parse(cleaned);
        return res.json({ quiz: quizData, source: 'gemini' });
      }

      // Fallback quiz generator
      const fallbackQuiz = generateFallbackQuiz(subject, topic, difficulty, count, examType);
      return res.json({ quiz: fallbackQuiz, source: 'curriculum-engine' });
    } catch (err: any) {
      console.error('Error in /api/gemini/quiz:', err);
      const fallbackQuiz = generateFallbackQuiz(
        req.body?.subject || 'Mathematics',
        req.body?.topic || 'Algebra',
        req.body?.difficulty || 'Medium',
        req.body?.count || 5,
        req.body?.examType || 'JAMB'
      );
      return res.json({ quiz: fallbackQuiz, source: 'fallback', note: err?.message });
    }
  });

  // AI Practice Problem Generator
  app.post('/api/gemini/practice', async (req: Request, res: Response) => {
    try {
      const {
        subject = 'Physics',
        topic = 'Mechanics',
        difficulty = 'Medium',
        count = 5,
        examType = 'WAEC',
      } = req.body;

      if (ai) {
        const prompt = `Generate ${count} interactive practice drill questions for:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Exam Alignment: ${examType}

Format strictly as JSON array:
[
  {
    "id": 1,
    "title": "Practice Problem 1",
    "question": "Clear problem statement",
    "hints": ["Hint 1 to nudge the student", "Hint 2 formula reminder"],
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correctIndex": 0,
    "stepByStepSolution": [
      "Identify the given variables: ...",
      "Recall formula: ...",
      "Substitute values and compute: ..."
    ],
    "keyTakeaway": "Crucial principle to remember"
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text?.trim() || '[]';
        const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const practiceData = JSON.parse(cleaned);
        return res.json({ practice: practiceData, source: 'gemini' });
      }

      const fallbackPractice = generateFallbackPractice(subject, topic, difficulty, count, examType);
      return res.json({ practice: fallbackPractice, source: 'curriculum-engine' });
    } catch (err: any) {
      console.error('Error in /api/gemini/practice:', err);
      const fallbackPractice = generateFallbackPractice(
        req.body?.subject || 'Physics',
        req.body?.topic || 'Mechanics',
        req.body?.difficulty || 'Medium',
        req.body?.count || 5,
        req.body?.examType || 'WAEC'
      );
      return res.json({ practice: fallbackPractice, source: 'fallback', note: err?.message });
    }
  });

  // Mount Vite or static files
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartTutor AI server running on http://0.0.0.0:${PORT}`);
  });
}

// Fallback response generators for high reliability
function generateFallbackTutorResponse({
  messages,
  studentLevel,
  subject,
  topic,
  actionType,
}: any): string {
  const lastUserMsg = [...messages].reverse().find((m: any) => m.sender === 'user')?.text || '';
  const lower = lastUserMsg.toLowerCase();

  if (actionType === 'simpler' || lower.includes('simple') || lower.includes('confused')) {
    return `Let's make this super simple! Think of it like cooking:

Imagine you have a recipe. If a formula looks intimidating, remember it is just a set of instructions telling you what to put in and what comes out.

1. **What we know**: Break the problem into small ingredients.
2. **What we need**: Identify the final dish you want to make.
3. **The step**: We just balance both sides so nothing spills!

Does this comparison make the concept clearer, or would you like another example from everyday life?`;
  }

  if (actionType === 'example' || lower.includes('example')) {
    return `Here is a clear, concrete example for **${topic || subject}**:

**Problem**: Suppose a car travels 120 kilometers in 2 hours. What is its average speed?
- **Step 1 (Identify given facts)**: Distance ($d$) = 120 km, Time ($t$) = 2 hours.
- **Step 2 (Select formula)**: Speed = Distance ÷ Time.
- **Step 3 (Substitute)**: Speed = 120 ÷ 2 = **60 km/h**.

Notice how we separated what was given before doing any arithmetic. Would you like to try calculating one with different numbers now?`;
  }

  if (actionType === 'hint' || lower.includes('hint')) {
    return `💡 **Tutor Hint**:
Look closely at the terms on the left side of your equation or sentence.
- Ask yourself: Can any like terms be grouped together first?
- Remember the inverse operation: if something is added, what cancels it out?
Try that first step and tell me what expression you get!`;
  }

  if (actionType === 'quiz' || lower.includes('quiz') || lower.includes('test me')) {
    return `Let's do a quick comprehension check on **${topic || subject}**:

**Question 1**: If $2x + 6 = 14$, what is the first step you should take to isolate $x$?
A) Multiply both sides by 2
B) Subtract 6 from both sides
C) Divide 14 by 6
D) Add 6 to both sides

Reply with your answer and your reason why!`;
  }

  if (lower.includes('quadratic') || topic?.toLowerCase().includes('quadratic')) {
    return `Welcome! Let's explore **Quadratic Equations** step-by-step:

A quadratic equation is any equation where the highest power of the variable is 2. The standard form is:
**ax² + bx + c = 0** (where a ≠ 0).

Here is the game plan to master them:
1. **Identify the coefficients**: What are $a$, $b$, and $c$?
2. **Choose your tool**:
   - Factorisation (quickest when factors are obvious)
   - Completing the square
   - The Quadratic Formula: **x = (-b ± √(b² - 4ac)) / (2a)**

Let's test this together: in the equation **x² - 5x + 6 = 0**, what are the values of $a$, $b$, and $c$? Give it a try!`;
  }

  if (lower.includes('fraction') || topic?.toLowerCase().includes('fraction')) {
    return `Fractions are simply equal slices of a whole!

Key rules to keep in your toolkit:
1. **Adding & Subtracting**: You MUST have a Common Denominator (LCM).
   - E.g., 1/4 + 2/4 = 3/4.
2. **Multiplying**: Multiply straight across! (Numerator × Numerator, Denominator × Denominator).
3. **Dividing**: Keep, Change, Flip! (Multiply by the reciprocal).

Which type of fraction problem would you like us to practice right now?`;
  }

  return `Hello! I'm your SmartTutor AI teacher. I'm here to guide you step-by-step through **${subject}** (${topic || 'Core Curriculum'}).

Let's tackle this concept together:
1. What part of **${topic || 'this topic'}** feels easiest for you right now?
2. Where does it start to feel tricky?

Feel free to paste any problem you're working on, or click the buttons below for a simpler explanation, worked example, or practice quiz!`;
}

function generateFallbackLesson(subject: string, topic: string, level: string, examType: string) {
  return {
    title: `${topic}`,
    subject,
    level,
    estimatedMinutes: 20,
    objectives: [
      `Master the core definition and fundamental principles of ${topic}`,
      `Solve standard problems step-by-step with confidence`,
      `Apply analytical reasoning required for ${examType} examination standards`,
    ],
    introduction: `Have you ever wondered how engineers, scientists, and analysts predict outcomes with precision? In ${subject}, ${topic} provides the essential building block to turn confusing problems into organized, solvable steps.`,
    explanation: `Let's break down ${topic} into three manageable concepts:
1. **The Fundamental Law**: Every calculation in this area starts by identifying known quantities and unknown targets.
2. **Structured Notation**: We translate word problems into clean mathematical or scientific relationships.
3. **Verification**: Always plug your answer back into the original condition to confirm it holds true.`,
    workedExamples: [
      {
        problem: `Given the foundational expression in ${topic}, determine the value of the unknown when primary input equals 4 and multiplier equals 3.`,
        stepByStepSolution: [
          'Step 1: Write down the governing equation.',
          'Step 2: Substitute the known values into the equation.',
          'Step 3: Perform operations in standard order (BODMAS / PEMDAS).',
          'Step 4: Final evaluated result equals 12.',
        ],
        keyTakeaway: 'Always verify units and check whether the magnitude of the answer makes real-world sense.',
      },
    ],
    interactiveQuestions: [
      {
        question: `In the study of ${topic}, which of the following statements is always true?`,
        options: [
          'A) Operations must preserve balance on both sides of the relation',
          'B) The unknown variable can never be negative',
          'C) Units do not need to be consistent',
          'D) Formulas only apply to whole numbers',
        ],
        answerIndex: 0,
        hint: 'Think about what keeps an equation or physical law valid across all systems.',
        explanation: 'Option A is correct because equality and physical conservation require balanced operations on both sides.',
      },
    ],
    practiceExercises: [
      {
        exercise: `Solve a standard problem on ${topic}: calculate the resultant when baseline is 15 and factor is 2.`,
        hint: 'Use the standard formula from Section 2.',
        solution: 'Substitute 15 × 2 = 30.',
      },
    ],
    shortQuiz: [
      {
        question: `What is the most effective first step when approaching a challenging ${topic} problem?`,
        options: [
          'A) Guess the final answer',
          'B) List given parameters and state what needs to be found',
          'C) Skip directly to difficult equations',
          'D) Change the units arbitrarily',
        ],
        correctIndex: 1,
        explanation: 'Writing down given parameters and target unknowns immediately clears ambiguity.',
      },
    ],
    summary: [
      `${topic} is governed by consistent, verifiable rules.`,
      'Step-by-step breakdown prevents common algebraic and reasoning traps.',
      `Regular practice with past ${examType} style questions builds speed and accuracy.`,
    ],
    homework: [
      {
        task: `Write a short 3-sentence summary of ${topic} in your own words.`,
        guidance: 'Imagine you are explaining this to a classmate who missed today’s lesson.',
      },
    ],
  };
}

function generateFallbackQuiz(subject: string, topic: string, difficulty: string, count: number, examType: string) {
  const isMath = subject.toLowerCase().includes('math') || topic.toLowerCase().includes('equation');
  const isScience = subject.toLowerCase().includes('phys') || subject.toLowerCase().includes('chem') || subject.toLowerCase().includes('bio');

  return {
    title: `${subject}: ${topic} Comprehensive Assessment`,
    difficulty,
    examType,
    timeLimitMinutes: Math.max(5, count * 2),
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: isMath
          ? `What is the solution set for the equation 2x + 8 = 20?`
          : `Which of the following is a primary characteristic of ${topic}?`,
        options: isMath
          ? ['A) x = 4', 'B) x = 6', 'C) x = 12', 'D) x = 14']
          : ['A) It operates under conservation principles', 'B) It cannot be measured', 'C) It has no units', 'D) It is purely theoretical'],
        correctAnswer: isMath ? 1 : 0,
        hint: isMath ? 'Subtract 8 from 20, then divide by 2.' : 'Think about fundamental scientific laws.',
        explanation: isMath
          ? '2x = 20 - 8 => 2x = 12 => x = 6.'
          : 'Conservation principles underpin all physical and chemical processes.',
      },
      {
        id: 2,
        type: 'tf',
        question: isMath
          ? `In a quadratic equation ax² + bx + c = 0, the coefficient 'a' can be equal to zero.`
          : `In ${subject}, empirical observations must be repeatable under the same experimental conditions.`,
        options: ['True', 'False'],
        correctAnswer: isMath ? 1 : 0,
        hint: isMath ? 'If a = 0, does the x² term survive?' : 'Consider the scientific method.',
        explanation: isMath
          ? 'False. If a = 0, the equation reduces to a linear equation (bx + c = 0).'
          : 'True. Reproducibility is a cornerstone of scientific methodology.',
      },
      {
        id: 3,
        type: 'mcq',
        question: `Under ${examType} examination grading standards, showing step-by-step working is required to gain full marks.`,
        options: ['A) Strongly True (Method marks are awarded)', 'B) False (Only final answers count)', 'C) Optional', 'D) Not applicable'],
        correctAnswer: 0,
        hint: 'Review marking guides for WAEC and NECO.',
        explanation: 'Examiners award distinct marks for formulas, correct substitution, and intermediate steps.',
      },
      {
        id: 4,
        type: 'short',
        question: isMath
          ? `Evaluate 3² + 4².`
          : `State the standard SI unit of force.`,
        correctAnswer: isMath ? '25' : 'Newton',
        hint: isMath ? 'Calculate 9 + 16.' : 'Named after Sir Isaac...',
        explanation: isMath
          ? '3² = 9 and 4² = 16. 9 + 16 = 25 (the classic Pythagorean triple).'
          : 'The SI unit of force is the Newton (N), defined as 1 kg·m/s².',
      },
      {
        id: 5,
        type: 'mcq',
        question: `When a student encounters a difficult question during an exam, the recommended strategy is to:`,
        options: [
          'A) Spend 20 minutes on it before moving on',
          'B) Mark it, move to easier questions, and return with remaining time',
          'C) Leave the exam hall early',
          'D) Randomly guess without reading',
        ],
        correctAnswer: 1,
        hint: 'Time management is key to maximizing scores.',
        explanation: 'Securing easy and medium marks first ensures the student builds momentum and preserves clock time.',
      },
    ].slice(0, count),
  };
}

function generateFallbackPractice(subject: string, topic: string, difficulty: string, count: number, examType: string) {
  return [
    {
      id: 1,
      title: `${topic} Drill #1`,
      question: `Given a standard problem in ${subject} (${topic}), calculate the output value when the base parameter is 10 and the multiplier is 5.`,
      hints: [
        'Check the formula sheet for the primary governing equation.',
        'Multiply the primary parameter by the rate.',
      ],
      options: ['A) 25', 'B) 50', 'C) 15', 'D) 2'],
      correctIndex: 1,
      stepByStepSolution: [
        'Step 1: Identify given quantities: Base = 10, Multiplier = 5.',
        'Step 2: Compute Product = 10 × 5 = 50.',
        'Step 3: Confirm units and magnitude.',
      ],
      keyTakeaway: 'Straightforward substitution gives accurate results when operations are executed sequentially.',
    },
    {
      id: 2,
      title: `${topic} Drill #2`,
      question: `Which formula correctly relates the variables in ${topic}?`,
      hints: [
        'Recall the definitions introduced during the interactive lesson.',
      ],
      options: [
        'A) Y = k · X (Direct proportionality)',
        'B) Y = X + constant solely',
        'C) Y = 0 always',
        'D) Variables are unrelated',
      ],
      correctIndex: 0,
      stepByStepSolution: [
        'Step 1: Check dimensional consistency on both sides.',
        'Step 2: Observe that increasing the input increases the output proportionally.',
      ],
      keyTakeaway: 'Direct variation ensures scaling the input scales the output by constant k.',
    },
    {
      id: 3,
      title: `${topic} Drill #3`,
      question: `If an error is detected in an intermediate calculation, the best practice is to:`,
      hints: [
        'Think about root-cause debugging.',
      ],
      options: [
        'A) Erase the entire paper',
        'B) Trace backward to the exact line where signs or operations flipped',
        'C) Ignore it and hope for the best',
        'D) Change the final answer blindly',
      ],
      correctIndex: 1,
      stepByStepSolution: [
        'Step 1: Scan for sign errors (e.g., negative times negative).',
        'Step 2: Check basic arithmetic steps.',
        'Step 3: Correct only the branch from the error point onward.',
      ],
      keyTakeaway: 'Methodical verification saves time during both practice and timed exams.',
    },
  ].slice(0, count);
}

startServer();
