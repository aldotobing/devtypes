"use client";

import { useLanguage } from "@/lib/language-context";
import { formatString } from "@/lib/i18n";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const { t } = useLanguage();
  const progress = (current / total) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-dev-gradient h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="mt-2 text-sm text-gray-600 text-center">
        {formatString(t.questionOf, { current: current.toString(), total: total.toString() })}
      </div>
    </div>
  );
}