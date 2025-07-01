"use client";

// No more spinning icons
import { useLanguage } from "@/lib/language-context";

interface LoadingOverlayProps {
  message?: string;
  mode?: "loadingQuestions" | "analyzing";
  aiService?: 'Gemini' | 'DeepSeek' | 'Fallback';
  fallbackReason?: string;
}

export default function LoadingOverlay({ message, mode, aiService, fallbackReason }: LoadingOverlayProps) {
  const { t } = useLanguage();
  const effectiveMode =
    (typeof mode === "string" ? mode : undefined) || "analyzing";
  const title =
    effectiveMode === "loadingQuestions"
      ? t.loadingQuestions
      : t.analyzingDevType;
  // Only show the message if it's custom and not the same as the title
  let displayMessage: string | null = null;
  if (message && message !== title) {
    displayMessage = message;
  } else if (effectiveMode === "analyzing") {
    displayMessage = t.processing;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-4">
          <div className="flex space-x-1 mb-2">
            <span className="block w-2 h-2 bg-purple-500 rounded-full animate-bounce loading-dot-1"></span>
            <span className="block w-2 h-2 bg-purple-400 rounded-full animate-bounce loading-dot-2"></span>
            <span className="block w-2 h-2 bg-purple-300 rounded-full animate-bounce loading-dot-3"></span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {aiService && (
          <div className="mb-2">
            <p className="text-purple-500 font-medium">
              {aiService === "Gemini" && "✨ Using Gemini AI"}
              {aiService === "DeepSeek" && "🚀 Using DeepSeek AI"}
              {aiService === "Fallback" && "📋 Using template questions"}
            </p>
            {fallbackReason && (
              <p className="text-xs text-orange-500 mt-1">
                {fallbackReason}
              </p>
            )}
          </div>
        )}
        {displayMessage && displayMessage !== title && (
          <p className="text-gray-600 mb-4">{displayMessage}</p>
        )}
        <div className="text-xs text-gray-400">{t.mightTakeMoment}</div>
      </div>
    </div>
  );
}
