
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface SurveyNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  buttonColor: string;
}

export const SurveyNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  buttonColor,
}: SurveyNavigationProps) => {
  if (totalQuestions === 0) return null;

  return (
    <div className="flex items-center justify-between pt-6">
      <button
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>{currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Continue'}</span>
        <ChevronRight className="ml-2 h-4 w-4" />
      </button>
      
      <button
        onClick={() => {/* Skip functionality */}}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Skip
      </button>
    </div>
  );
};
