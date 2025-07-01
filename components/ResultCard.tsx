"use client";

import { useEffect, useState } from "react";
import { PersonalityResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, RotateCcw, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { formatString } from "@/lib/i18n";

interface ResultCardProps {
  result: PersonalityResult;
  onRetake: () => void;
}

export default function ResultCard({ result, onRetake }: ResultCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);

  const handleRetake = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRetake();
      router.push("/quiz");
    }, 300);
  };

  const handleShare = async () => {
    const shareText = formatString(t.shareText, {
      type: result.type,
      quote: result.quote,
    });

    const shareData = {
      title: `I'm a ${result.type}!`,
      text: shareText,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback to clipboard if sharing fails
      await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    try {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `${shareText} - Discover your DevType at ${window.location.origin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div 
      className={`w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl mx-auto space-y-6 px-2 sm:px-4 transition-all duration-300 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300 px-2 sm:px-6 py-2 sm:py-6">
        <CardHeader className="text-center px-2 sm:px-4 pt-4 pb-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
            <CardTitle className="relative text-2xl xs:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
              {result.type}
            </CardTitle>
          </div>
          <p className="text-base xs:text-lg md:text-xl text-gray-700 leading-relaxed break-words whitespace-pre-line">
            {result.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 px-2 sm:px-4 pb-4">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-purple-100">
            <h3 className="font-semibold text-base xs:text-lg mb-3 text-gray-800 flex items-center">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                {result.suitableRoles.length}
              </span>
              {t.perfectRoles}
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.suitableRoles.map((role, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs xs:text-sm md:text-base px-3 py-1.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
            <div className="relative bg-white p-4 sm:p-5 rounded-lg border-l-4 border-purple-500 shadow-sm group-hover:shadow-md transition-all duration-300">
              <blockquote className="relative">
                <div className="absolute -top-3 -left-3 text-4xl text-purple-200">"</div>
                <p className="italic text-base xs:text-lg text-gray-700 font-medium break-words whitespace-pre-line relative z-10">
                  {result.quote}
                </p>
                <div className="absolute -bottom-4 -right-3 text-4xl text-purple-200 transform rotate-180">"</div>
              </blockquote>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-base xs:text-lg py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {'copied' in t ? t.copied : 'Copied!'}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {'shareMyDevType' in t ? t.shareMyDevType : 'Share My DevType'}
                </>
              )}
            </Button>
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 text-base xs:text-lg py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {'retakeTest' in t ? t.retakeTest : 'Retake Test'}
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-400 mt-2">
            {('shareNote' in t ? t.shareNote : 'Share your developer personality with friends!') as React.ReactNode}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-gray-400 mt-4">
        {('resultsDisclaimer' in t ? t.resultsDisclaimer : 'Results are based on your answers and are for entertainment purposes only.') as React.ReactNode}
      </div>
    </div>
  );
}
