export interface Question {
  question: string;
  options: string[];
}

export interface PersonalityResult {
  type: string;
  description: string;
  suitableRoles: string[];
  quote: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: string[];
  isLoading: boolean;
  result: PersonalityResult | null;
}