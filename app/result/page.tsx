"use client";
// Note: Metadata is handled in layout.tsx and metadata.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PersonalityResult } from "@/lib/types";
import { analyzeAnswers } from "@/lib/ai";
import ResultCard from "@/components/ResultCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/i18n";

export default function ResultPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only analyze if result is null and not already loading
    if (!result && isLoading) {
      analyzeUserAnswers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeUserAnswers = async () => {
    try {
      const storedAnswers = localStorage.getItem("devtype-answers");
      const storedQuestions = localStorage.getItem("devtype-questions");
      const storedLanguage = localStorage.getItem(
        "devtype-language"
      ) as Language;
      if (!storedAnswers || !storedQuestions) {
        router.push("/");
        return;
      }
      const answers = JSON.parse(storedAnswers);
      const questions = JSON.parse(storedQuestions);
      const analysisLanguage = storedLanguage || language;
      if (!isLoading) setIsLoading(true); // Only set if not already loading
      const personalityResult = await analyzeAnswers(
        questions,
        answers,
        analysisLanguage
      );
      setResult(personalityResult);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to analyze answers:", error);
      setError(t.analysisFailed);
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    localStorage.removeItem("devtype-answers");
    localStorage.removeItem("devtype-language");
    setResult(null);
    setIsLoading(false);
    setError(null);
  };

  const handleGoHome = () => {
    localStorage.removeItem("devtype-answers");
    localStorage.removeItem("devtype-language");
    router.push("/");
  };

  if (isLoading) {
    return <LoadingOverlay message={t.analyzingDNA} />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 break-normal whitespace-normal">
            {t.analysisFailed}
          </h2>
          <p className="text-gray-600 leading-relaxed break-normal whitespace-normal">
            {error}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={analyzeUserAnswers}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {t.tryAgain}
            </Button>
            <Button onClick={handleGoHome} variant="outline">
              {t.startOver}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 break-normal whitespace-normal">
            {t.noResultsFound}
          </h2>
          <p className="text-gray-600 leading-relaxed break-normal whitespace-normal">
            {t.haventTakenQuiz}
          </p>
          <Button
            onClick={() => router.push("/quiz")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {t.takeQuiz}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={handleGoHome}
            className="flex items-center space-x-2 mx-auto"
          >
            <Home size={16} />
            <span>{t.backToHome}</span>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 break-normal whitespace-normal">
            {t.yourResults} 🎉
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mx-auto max-w-xl break-normal whitespace-normal">
            {t.resultsSubtitle}
          </p>
        </div>

        {/* Results */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl break-normal whitespace-normal">
            <ResultCard result={result} onRetake={handleRetake} />
          </div>
        </div>

        {/* Share encouragement */}
        <div className="text-center space-y-2 mt-12 mx-auto max-w-xl">
          <p className="text-gray-600 break-normal whitespace-normal">
            {t.thinksFits}
          </p>
          <p className="text-sm text-gray-500 break-normal whitespace-normal">
            {t.helpImprove}
          </p>
        </div>
      </div>
    </div>
  );
}
