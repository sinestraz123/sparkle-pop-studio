
import { X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SurveyHeaderProps {
  title: string;
  description?: string;
  textColor: string;
  showCloseButton: boolean;
  showProgress: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

export const SurveyHeader = ({
  title,
  description,
  textColor,
  showCloseButton,
  showProgress,
  currentQuestionIndex,
  totalQuestions,
  progress,
}: SurveyHeaderProps) => {
  return (
    <>
      {showCloseButton && (
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2" style={{ color: textColor }}>
          {title || 'Survey Title'}
        </h2>
        {description && (
          <p className="text-sm opacity-75" style={{ color: textColor }}>
            {description}
          </p>
        )}
      </div>

      {showProgress && totalQuestions > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2" style={{ color: textColor }}>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </>
  );
};
