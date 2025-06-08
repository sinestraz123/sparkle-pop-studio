
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      <Button
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        style={{ backgroundColor: buttonColor }}
        className="flex items-center space-x-2 text-white"
      >
        <span>{currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
