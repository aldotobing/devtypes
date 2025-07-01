"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, QuizState } from "@/lib/types";
import { generateQuestions, getFallbackQuestions } from "@/lib/ai";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import LoadingOverlay from "@/components/LoadingOverlay";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function QuizPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [quizState, setQuizState] = useState<QuizState & { 
    aiUsed?: string;
    currentAiService?: 'Gemini' | 'DeepSeek' | 'Fallback';
    fallbackReason?: string;
  }>({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isLoading: true,
    result: null,
    aiUsed: undefined,
    currentAiService: undefined,
  });

  useEffect(() => {
    loadQuestions();
  }, [language]);

  const loadQuestions = async () => {
    try {
      setQuizState(prev => ({ ...prev, isLoading: true }));
      
      // Track the AI service and fallback reason
      const updateAiStatus = (service: 'Gemini' | 'DeepSeek' | 'Fallback', reason?: string) => {
        setQuizState(prev => ({ 
          ...prev, 
          currentAiService: service,
          fallbackReason: reason
        }));
      };

      // Check if a service is available
      const checkServiceAvailability = async (service: 'Gemini' | 'DeepSeek'): Promise<boolean> => {
        try {
          const endpoint = service === 'Gemini' 
            ? `${process.env.NEXT_PUBLIC_GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'}?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`
            : process.env.NEXT_PUBLIC_AI_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions';
          
          // Use a lightweight POST request with minimal data to check service availability
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(service === 'DeepSeek' && {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`
              })
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: 'test' // Minimal request to check if service is up
                }]
              }]
            })
          });
          
          // If we get any response, even an error, the service is reachable
          // We'll let the actual API call handle the specific errors
          return response.status !== 404 && response.status !== 403;
        } catch (error) {
          console.error(`${service} availability check failed:`, error);
          return false;
        }
      };

      // Create a wrapper around generateQuestions to track which AI is being used
      const generateWithTracking = async () => {
        // Check Gemini first
        updateAiStatus('Gemini', 'Checking service availability...');
        try {
          const isGeminiAvailable = await checkServiceAvailability('Gemini');
          
          if (!isGeminiAvailable) {
            updateAiStatus('Gemini', 'Service unavailable, trying DeepSeek...');
            // Add a small delay to ensure the UI updates
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error('Gemini service is not available');
          }
          
          updateAiStatus('Gemini', 'Generating questions...');
          const result = await generateQuestions(language);
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn('Gemini failed, trying DeepSeek...', errorMessage);
          updateAiStatus('Gemini', `Service error: ${errorMessage}`);
          // Add a small delay to ensure the UI updates
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Try DeepSeek if Gemini fails or is unavailable
        updateAiStatus('DeepSeek', 'Checking DeepSeek availability...');
        try {
          const isDeepSeekAvailable = await checkServiceAvailability('DeepSeek');
          
          if (!isDeepSeekAvailable) {
            updateAiStatus('DeepSeek', 'Service unavailable, using fallback questions');
            // Add a small delay to ensure the UI updates
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error('DeepSeek service is not available');
          }
          
          updateAiStatus('DeepSeek', 'Generating questions...');
          const result = await generateQuestions(language);
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn('DeepSeek failed, using fallback questions', errorMessage);
          updateAiStatus('DeepSeek', `Service error: ${errorMessage}`);
          // Add a small delay to ensure the UI updates
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Use fallback questions if all else fails
        updateAiStatus('Fallback', 'Falling back to template questions');
        return { 
          questions: getFallbackQuestions(language), 
          aiUsed: 'Fallback' 
        };
      };

      const { questions, aiUsed } = await generateWithTracking();
      
      setQuizState(prev => ({
        ...prev,
        questions,
        aiUsed,
        isLoading: false,
        currentAiService: undefined, // Reset after loading is complete
      }));
    } catch (error) {
      console.error("Failed to load questions:", error);
      setQuizState(prev => ({ 
        ...prev, 
        isLoading: false,
        currentAiService: undefined 
      }));
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...quizState.answers, answer];
    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex >= quizState.questions.length) {
      // Quiz completed, store answers and navigate to results
      localStorage.setItem("devtype-answers", JSON.stringify(newAnswers));
      localStorage.setItem("devtype-questions", JSON.stringify(quizState.questions));
      localStorage.setItem("devtype-language", language);
      router.push("/result");
    } else {
      setQuizState((prev) => ({
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
      }));
    }
  };

  const handleBack = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        answers: prev.answers.slice(0, -1),
      }));
    } else {
      router.push("/");
    }
  };

  if (quizState.isLoading) {
    return (
      <LoadingOverlay 
        message={t.loadingQuestions} 
        mode="loadingQuestions" 
        aiService={quizState.currentAiService}
        fallbackReason={quizState.fallbackReason}
      />
    );
  }

  if (quizState.questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {t.somethingWrong}
          </h2>
          <p className="text-gray-600">{t.couldntLoadQuestions}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            {t.goBackHome}
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>{t.back}</span>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t.devTypeAssessment}
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Progress */}
        <ProgressBar
          current={quizState.currentQuestionIndex + 1}
          total={quizState.questions.length}
          className="mb-8"
        />

        {/* Question */}
        <div className="flex justify-center items-center min-h-[400px]">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            aiUsed={quizState.aiUsed}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          {t.answerHonestly}
        </div>
      </div>
    </div>
  );
}
