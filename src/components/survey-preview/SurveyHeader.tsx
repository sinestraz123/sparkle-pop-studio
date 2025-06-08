
import { X } from 'lucide-react';

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
        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-5 w-5" />
        </button>
      )}

      {showProgress && totalQuestions > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gray-900 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3" style={{ color: textColor }}>
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </>
  );
};
