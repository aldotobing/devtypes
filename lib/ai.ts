import { Question, PersonalityResult } from "./types";
import { Language } from "./i18n";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const AI_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

const GEMINI_ENDPOINT =
  process.env.NEXT_PUBLIC_GEMINI_ENDPOINT ||
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const AI_ENDPOINT =
  process.env.NEXT_PUBLIC_AI_ENDPOINT ||
  "https://api.deepseek.com/v1/chat/completions";

export async function generateQuestions(
  language: Language = "en"
): Promise<{ questions: Question[]; aiUsed: string }> {
  // Function to extract and fix JSON from text
  const extractAndFixJson = (text: string): Question[] | null => {
    if (!text) return null;
    
    // First, try to extract JSON from markdown code block if present
    let jsonContent = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonContent = codeBlockMatch[1].trim();
    }
    
    // Try direct JSON parse first
    try {
      const directParse = JSON.parse(jsonContent);
      if (Array.isArray(directParse)) return directParse;
      if (typeof directParse === 'object') return [directParse];
    } catch (e) {
      // If direct parse fails, try to extract and clean JSON
      try {
        // Try to find JSON array in the text
        const jsonMatch = jsonContent.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        if (jsonMatch) {
          // Clean up common JSON issues
          const fixedJson = jsonMatch[0]
            .replace(/([{\[,])\s*([}\]])/g, '$1$2')  // Remove trailing commas
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')  // Add quotes around unquoted keys
            .replace(/([a-zA-Z0-9_]+?)\s*:/g, '"$1":')  // Handle keys at start of object
            .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
            .replace(/,\s*\]/g, ']')  // Remove trailing commas in arrays
            .replace(/\\"/g, '"')  // Unescape escaped quotes
            .replace(/\\n/g, '\\n')  // Preserve newlines in strings
            .replace(/\n/g, '')  // Remove actual newlines in JSON structure
            .replace(/\s+/g, ' ');  // Normalize spaces
          
          const parsed = JSON.parse(fixedJson);
          if (Array.isArray(parsed)) return parsed;
          if (typeof parsed === 'object') return [parsed];
        }
      } catch (e) {
        console.warn('Failed to fix JSON:', e);
        console.warn('Problematic JSON content:', jsonContent.substring(0, 500));
      }
    }
    return null;
  };

  // Function to ensure we have exactly 8 questions
  const ensureQuestionCount = (questions: Question[]): Question[] => {
    if (!questions || !Array.isArray(questions)) {
      return getFallbackQuestions(language).slice(0, 8);
    }
    
    if (questions.length === 8) return questions;
    
    if (questions.length > 8) {
      return questions.slice(0, 8);
    }
    
    // If we don't have enough questions, pad with fallback questions
    const fallbackQuestions = getFallbackQuestions(language);
    return [...questions, ...fallbackQuestions.slice(0, 8 - questions.length)];
  };
  const isIndonesian = language === "id";
  const prompt = isIndonesian
    ? `Buat 8 pertanyaan pilihan ganda untuk tes kepribadian developer. Setiap pertanyaan harus mengeksplorasi aspek berbeda dari pola pikir, gaya kerja, dan preferensi developer.

Topik yang harus dicakup:
- Pendekatan debugging
- Menangani deadline dan tekanan
- Mempelajari teknologi baru
- Sikap terhadap code review
- Metode pemecahan masalah
- Kolaborasi tim
- Keputusan arsitektur
- Masalah produksi

Setiap pertanyaan harus memiliki tepat 4 pilihan. Buat pertanyaan yang relatable untuk developer dengan sentuhan humor. Gunakan bahasa santai, gaul, dan tidak terlalu formal/kaku, seolah-olah ngobrol dengan teman sesama developer. TOLONG jangan sertakan huruf opsi (A, B, C, D) di dalam teks pilihan, karena akan ditambahkan secara otomatis.

Contoh di bawah ini hanya untuk format, JANGAN disalin atau terlalu mirip. Buat pertanyaan dan opsi yang kreatif, unik, dan bervariasi setiap kali.

Kembalikan HANYA array JSON yang valid dalam format ini:
[
  {
    "question": "🐛 Apa pendekatan debugging kamu?",
    "options": ["Console.log semua", "Step through dengan debugger", "Google errornya", "Tanya ChatGPT"]
  }
]
  
WITHOUT ANY ADDITIONAL COMMENT OR RESPONSE`
    : `Generate 8 multiple-choice questions for a developer personality test. Each question should explore different aspects of a developer's mindset, work style, and preferences.

Topics to cover (you can also add your own other than these):
- Debugging approaches
- Handling deadlines and pressure
- Learning new technologies
- Code review attitudes
- Problem-solving methods
- Team collaboration
- Architecture decisions
- Production issues

Each question should have exactly 4 options. Make the questions relatable to developers with a touch of humor. Use a friendly, casual, and conversational tone (not too formal), as if chatting with fellow devs. IMPORTANT: Do NOT include the option letters (A, B, C, D) in the option text itself, as these will be added automatically.

The example below is ONLY for format reference. Do NOT copy or stick too closely to it. Be creative, original, and make each set of questions and options unique and varied every time.

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "🐛 What's your debugging approach?",
    "options": ["Console.log everything", "Step through with debugger", "Google the error", "Ask ChatGPT"]
  }
]
  
WITHOUT ANY ADDITIONAL COMMENT OR RESPONSE`;



  // Try Gemini first
  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });
    
    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status} ${geminiRes.statusText}`);
    }
    
    const geminiData = await geminiRes.json();
    //console.log('Gemini API Response:', JSON.stringify(geminiData, null, 2));
    
    const geminiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    //console.log('Extracted Gemini Text:', geminiText);
    
    if (geminiText) {
      try {
        const questions = extractAndFixJson(geminiText);
        //console.log('Parsed Questions:', questions);
        
        if (questions) {
          // Ensure we have exactly 8 questions
          const finalQuestions = questions.slice(0, 8);
          if (finalQuestions.length < 8) {
            const fallbackQuestions = getFallbackQuestions(language);
            finalQuestions.push(...fallbackQuestions.slice(0, 8 - finalQuestions.length));
          }
          return { questions: finalQuestions, aiUsed: "Gemini" };
        }
      } catch (error) {
        const parseError = error as Error;
        console.error('Error parsing Gemini response:', parseError);
        console.error('Response text that failed to parse:', geminiText?.substring(0, 500)); // Show first 500 chars of failed response
        throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
      }
    }
    
    console.error('No valid text content found in Gemini response');
    throw new Error('Failed to extract content from Gemini response');
  } catch (geminiError) {
    console.error('Gemini API call failed, trying DeepSeek...', geminiError);
  }
  
  // Try DeepSeek as fallback
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: isIndonesian
              ? "Anda adalah ahli dalam psikologi developer dan penilaian kepribadian. Buat pertanyaan yang menarik dan relatable untuk tes kepribadian developer dalam bahasa Indonesia."
              : "You are an expert in developer psychology and personality assessment. Generate engaging, relatable questions for a developer personality test.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const questions = extractAndFixJson(content);
      if (questions) {
        // Ensure we have exactly 8 questions
        const finalQuestions = questions.slice(0, 8);
        if (finalQuestions.length < 8) {
          const fallbackQuestions = getFallbackQuestions(language);
          finalQuestions.push(...fallbackQuestions.slice(0, 8 - finalQuestions.length));
        }
        return { questions: finalQuestions, aiUsed: "DeepSeek" };
      }
    }
    
    // If we get here, we couldn't extract valid questions
    throw new Error('Failed to parse DeepSeek response');
    
  } catch (error) {
    const err = error as Error;
    console.warn('DeepSeek API call failed, falling back to template questions. Reason:', err.message);
    return { questions: getFallbackQuestions(language), aiUsed: "Fallback" };
  }
}

export async function analyzeAnswers(
  questions: Question[],
  answers: string[],
  language: Language = "en"
): Promise<PersonalityResult> {
  // Pair each question with its answer
  const qaPairs = questions
    .map((q, i) => {
      return `${i + 1}. ${q.question}\n   Answer: ${answers[i]}`;
    })
    .join("\n");
  const isIndonesian = language === "id";
  const prompt = isIndonesian
    ? `Analisis hasil tes kepribadian developer berikut. Untuk setiap pertanyaan, berikut jawaban user:\n\n${qaPairs}\n\nIdentifikasi pola, kecenderungan, dan preferensi dari jawaban-jawaban ini. Berdasarkan analisis tersebut, buat profil kepribadian developer yang mencakup:\n1. Nama tipe kepribadian yang kreatif dan mudah diingat (misal \"Arsitek Astronot\" atau \"Detektif Debug\")\n2. Deskripsi SINGKAT (maksimal 5 kalimat) tentang gaya coding dan pendekatan kerja mereka, yang benar-benar mencerminkan jawaban mereka\n3. 3-4 peran pekerjaan yang paling cocok dengan tipe ini, berdasarkan jawaban\n4. Quote yang jenaka dan relatable yang menangkap esensi mereka\n\nJangan buat tipe atau role yang generik atau acak. Pastikan semuanya relevan dengan jawaban. Gunakan referensi budaya developer dan humor.\n\nKembalikan HANYA objek JSON yang valid dalam format ini:\n{\n  \"type\": \"Si Fanatik Framework\",\n  \"description\": \"Anda suka mengeksplorasi teknologi baru...\",\n  \"suitableRoles\": [\"Frontend Engineer\", \"Tech Lead\", \"Developer Advocate\", \"Innovation Engineer\"],\n  \"quote\": \"Kalau bukan beta, berarti sudah legacy code.\"\n}`
    : `Analyze the following developer personality test. For each question, here is the user's answer:\n\n${qaPairs}\n\nIdentify patterns, tendencies, and preferences from these question-answer pairs. Based on this analysis, create a developer personality profile that includes:\n1. A creative, memorable personality type name (e.g. \"The Architecture Astronaut\" or \"The Debug Detective\")\n2. A CONCISE description (max 5 sentences) of their coding style and work approach, which truly reflects their answers\n3. 3-4 job roles that are the best fit for this personality, based on the answers\n4. A witty, relatable quote that captures their essence\n\nDo not generate generic or random types or roles. Make sure everything is relevant to the answers. Use developer culture references and humor.\n\nReturn ONLY a valid JSON object in this exact format:\n{\n  \"type\": \"The Framework Fanatic\",\n  \"description\": \"You love exploring new technologies...\",\n  \"suitableRoles\": [\"Frontend Engineer\", \"Tech Lead\", \"Developer Advocate\", \"Innovation Engineer\"],\n  \"quote\": \"If it's not in beta, it's already legacy code.\"\n}`;

  // Try Gemini first
  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });
    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      const geminiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        const clean = geminiText.replace(/```[a-z]*|```/gi, "").trim();
        // Extract the first JSON object from the string
        const objMatch = clean.match(/\{[\s\S]*?\}/);
        if (objMatch) {
          const jsonObj = objMatch[0];
          const result = JSON.parse(jsonObj);
          if (
            result.type &&
            result.description &&
            result.suitableRoles &&
            result.quote
          ) {
            return result;
          }
        }
      }
    }
    throw new Error("Gemini failed or returned invalid data");
  } catch (err) {
    // Try DeepSeek as fallback
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: isIndonesian
                ? "Anda adalah ahli dalam psikologi developer dan penilaian kepribadian. Analisis pola perilaku developer dan buat profil kepribadian yang menarik dalam bahasa Indonesia."
                : "You are an expert in developer psychology and personality assessment. Analyze developer behavior patterns and create engaging personality profiles.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.9,
          max_tokens: 2000,
        }),
      });
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices[0].message.content;
      // Remove all code block markers and trim
      const clean = content.replace(/```[a-z]*|```/gi, "").trim();
      // Extract the first JSON object from the string
      const objMatch = clean.match(/\{[\s\S]*?\}/);
      if (objMatch) {
        const jsonObj = objMatch[0];
        const result = JSON.parse(jsonObj);
        if (
          result.type &&
          result.description &&
          result.suitableRoles &&
          result.quote
        ) {
          return result;
        }
      }
      throw new Error("Invalid result format from AI");
    } catch (error) {
      console.error("Error analyzing answers:", error);
      // Fallback result if AI fails
      return getFallbackResult(answers, language);
    }
  }
}

export function getFallbackQuestions(language: Language = "en"): Question[] {
  if (language === "id") {
    return [
      {
        question: "🐛 Apa pendekatan debugging Anda?",
        options: [
          "Console.log semua",
          "Step through dengan debugger",
          "Google errornya",
          "Tanya ChatGPT",
        ],
      },
      {
        question: "🚀 Bagaimana Anda menangani deadline ketat?",
        options: [
          "Kerja lembur",
          "Potong fitur",
          "Technical debt gak apa-apa",
          "Negosiasi timeline",
        ],
      },
      {
        question: "📚 Framework baru keluar. Reaksi Anda?",
        options: [
          "Harus coba sekarang juga",
          "Tunggu feedback komunitas",
          "Kalau gak rusak...",
          "Baca docs dulu",
        ],
      },
      {
        question: "🔧 Bagian favorit dari development?",
        options: [
          "Nulis clean code",
          "Solve masalah kompleks",
          "Bikin user interface",
          "Optimasi performa",
        ],
      },
      {
        question: "👥 Code review bikin Anda...",
        options: [
          "Excited buat belajar",
          "Defensif",
          "Cuek aja",
          "Pengen bantu orang lain",
        ],
      },
      {
        question: "🎯 Apa yang paling memotivasi Anda?",
        options: [
          "Impact ke user",
          "Tantangan teknis",
          "Kolaborasi tim",
          "Personal growth",
        ],
      },
      {
        question: "🏗️ Pendekatan Anda ke arsitektur?",
        options: [
          "Plan semua di depan",
          "Evolve sesuai kebutuhan",
          "Ikuti pattern",
          "Keep it simple",
        ],
      },
      {
        question: "⚡ Ketika produksi error...",
        options: [
          "Tetap tenang dan debug",
          "Panik sedikit",
          "Rollback langsung",
          "Panggil tim",
        ],
      },
    ];
  }

  return [
    {
      question: "🐛 What's your debugging approach?",
      options: [
        "Console.log everything",
        "Step through with debugger",
        "Google the error",
        "Ask ChatGPT",
      ],
    },
    {
      question: "🚀 How do you handle tight deadlines?",
      options: [
        "Work overtime",
        "Cut features",
        "Technical debt is fine",
        "Negotiate timeline",
      ],
    },
    {
      question: "📚 New framework just dropped. Your reaction?",
      options: [
        "Must try immediately",
        "Wait for community feedback",
        "If it ain't broke...",
        "Read the docs first",
      ],
    },
    {
      question: "🔧 Your favorite part of development?",
      options: [
        "Writing clean code",
        "Solving complex problems",
        "Building user interfaces",
        "Optimizing performance",
      ],
    },
    {
      question: "👥 Code reviews make you...",
      options: [
        "Excited to learn",
        "Defensive",
        "Indifferent",
        "Want to help others",
      ],
    },
    {
      question: "🎯 What motivates you most?",
      options: [
        "User impact",
        "Technical challenges",
        "Team collaboration",
        "Personal growth",
      ],
    },
    {
      question: "🏗️ Your approach to architecture?",
      options: [
        "Plan everything upfront",
        "Evolve as needed",
        "Follow patterns",
        "Keep it simple",
      ],
    },
    {
      question: "⚡ When production breaks...",
      options: [
        "Stay calm and debug",
        "Panic slightly",
        "Rollback immediately",
        "Call the team",
      ],
    },
  ];
}

async function generatePersonalityTypes(
  language: Language = "en"
): Promise<PersonalityResult[]> {
  const isIndonesian = language === "id";
  const prompt = isIndonesian
    ? `Buat 4 tipe kepribadian developer yang kreatif dan mudah diingat. Untuk setiap tipe, berikan:
1. Nama tipe kepribadian
2. Deskripsi singkat tentang gaya coding dan pendekatan kerja
3. 3-4 peran pekerjaan yang cocok
4. Quote yang jenaka dan relatable

Gunakan bahasa santai, gaul, dan tidak terlalu formal/kaku, seolah-olah ngobrol dengan teman sesama developer.

Contoh di bawah ini hanya untuk format, JANGAN disalin atau terlalu mirip.

Kembalikan HANYA array JSON yang valid dalam format ini (contoh):
[
  {
    "type": "Si Fanatik Framework",
    "description": "Kamu suka banget eksplor teknologi baru...",
    "suitableRoles": ["Frontend Engineer", "Tech Lead", "Developer Advocate", "Innovation Engineer"],
    "quote": "Kalau bukan beta, berarti udah legacy code."
  }
]`
    : `Generate 4 creative, memorable developer personality types. For each type, provide:
1. Type name
2. Short description of coding style and work approach
3. 3-4 suitable job roles
4. A witty, relatable quote

Use a friendly, casual, and conversational tone (not too formal), as if chatting with fellow devs.

The example below is ONLY for format reference.

Return ONLY a valid JSON array in this exact format (example):
[
  {
    "type": "The Framework Fanatic",
    "description": "You love exploring new technologies...",
    "suitableRoles": ["Frontend Engineer", "Tech Lead", "Developer Advocate", "Innovation Engineer"],
    "quote": "If it's not in beta, it's already legacy code."
  }
]`;

  // Try Gemini first
  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });
    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      const geminiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        const clean = geminiText.replace(/```json|```/g, "").trim();
        const types = JSON.parse(clean);
        if (Array.isArray(types) && types.length >= 1) {
          return types;
        }
      }
    }
    throw new Error("Gemini failed or returned invalid data");
  } catch (err) {
    // Try DeepSeek as fallback
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: isIndonesian
                ? "Anda adalah ahli dalam psikologi developer dan penilaian kepribadian. Buat tipe kepribadian developer yang menarik dan relatable dalam bahasa Indonesia."
                : "You are an expert in developer psychology and personality assessment. Generate engaging, relatable developer personality types.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 1,
          max_tokens: 1500,
        }),
      });
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices[0].message.content;
      const clean = content.replace(/```json|```/g, "").trim();
      const types = JSON.parse(clean);
      if (!Array.isArray(types) || types.length < 1) {
        throw new Error("Invalid types format from AI");
      }
      return types;
    } catch (error) {
      console.error("Error generating personality types:", error);
      // Fallback to a single generic type
      return [
        {
          type: isIndonesian ? "Tipe Developer" : "Developer Type",
          description: isIndonesian
            ? "Deskripsi fallback."
            : "Fallback description.",
          suitableRoles: [isIndonesian ? "Engineer" : "Engineer"],
          quote: isIndonesian ? "Quote fallback." : "Fallback quote.",
        },
      ];
    }
  }
}

// Try to match fallback type to answers (very basic keyword matching)
async function getFallbackResult(
  answers: string[],
  language: Language = "en"
): Promise<PersonalityResult> {
  const types = await generatePersonalityTypes(language);
  // Simple keyword heuristics for mapping answers to types
  const answerText = answers.join(" ").toLowerCase();
  let bestMatchIdx = 0;
  let bestScore = -1;
  types.forEach((type, idx) => {
    let score = 0;
    if (type.type && answerText.includes(type.type.toLowerCase())) score += 2;
    if (type.description) {
      const desc = type.description.toLowerCase();
      if (answerText.includes("debug")) score += desc.includes("debug") ? 2 : 0;
      if (answerText.includes("framework"))
        score += desc.includes("framework") ? 2 : 0;
      if (answerText.includes("team")) score += desc.includes("team") ? 2 : 0;
      if (answerText.includes("optim")) score += desc.includes("optim") ? 1 : 0;
      if (answerText.includes("simple"))
        score += desc.includes("simple") ? 1 : 0;
      if (answerText.includes("growth"))
        score += desc.includes("growth") ? 1 : 0;
      if (answerText.includes("review"))
        score += desc.includes("review") ? 1 : 0;
      if (answerText.includes("deadline"))
        score += desc.includes("deadline") ? 1 : 0;
    }
    if (type.suitableRoles && Array.isArray(type.suitableRoles)) {
      type.suitableRoles.forEach((role) => {
        if (answerText.includes(role.toLowerCase())) score += 1;
      });
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatchIdx = idx;
    }
  });
  return types[bestMatchIdx];
}
