"use client";

import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  className?: string;
  aiUsed?: string;
}

export default function QuestionCard({
  question,
  onAnswer,
  className = "",
  aiUsed,
}: QuestionCardProps) {
  return (
    <Card className={`w-full max-w-xl mx-auto shadow-md ${className} relative`}>
      {/* AI badge in top right */}
      {aiUsed && (
        <div className="absolute top-3 right-4 z-10">
          <span className="inline-block bg-gray-50 text-xs text-gray-500 rounded-full px-3 py-1 border border-gray-200 shadow-sm">
            <span className="font-semibold text-purple-500">{aiUsed}</span> AI
          </span>
        </div>
      )}
      <CardHeader className="pb-1 pt-12">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-left leading-snug text-gray-800">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4 pt-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left justify-start p-3 h-auto whitespace-normal text-base font-normal hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 rounded-lg"
            onClick={() => onAnswer(String.fromCharCode(65 + index))}
          >
            <span className="font-semibold text-purple-600 mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="text-gray-800">{option}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
