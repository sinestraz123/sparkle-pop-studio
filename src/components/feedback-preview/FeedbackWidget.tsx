
import { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { FeedbackConfig } from '@/components/FeedbackBuilder';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackWidgetProps {
  config: FeedbackConfig;
}

interface StepResponse {
  stepId: string;
  type: 'rating' | 'text';
  value: number | string;
  question: string;
}

export const FeedbackWidget = ({ config }: FeedbackWidgetProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<StepResponse[]>([]);
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible || isCompleted) return null;

  const currentStep = config.steps[currentStepIndex];
  const isLastStep = currentStepIndex === config.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const getPositionClasses = () => {
    switch (config.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      default:
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
    }
  };

  const canAdvance = () => {
    if (!currentStep.required) return true;
    
    if (currentStep.type === 'short') {
      return currentText.trim().length > 0;
    }
    
    return currentRating !== null;
  };

  const saveFeedbackToDatabase = async (allResponses: StepResponse[]) => {
    try {
      const { error } = await supabase
        .from('feedback_responses')
        .insert({
          config_id: config.id,
          responses: allResponses as any,
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving feedback:', error);
      } else {
        console.log('Feedback saved successfully');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleNext = async () => {
    // Save current response
    const response: StepResponse = {
      stepId: currentStep.id,
      type: currentStep.type === 'short' ? 'text' : 'rating',
      value: currentStep.type === 'short' ? currentText : currentRating!,
      question: currentStep.question,
    };

    const updatedResponses = [...responses.filter(r => r.stepId !== currentStep.id), response];
    setResponses(updatedResponses);

    if (isLastStep) {
      setIsSubmitting(true);
      await saveFeedbackToDatabase(updatedResponses);
      console.log('Feedback completed:', updatedResponses);
      setIsCompleted(true);
      setIsSubmitting(false);
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setCurrentRating(null);
      setCurrentText('');
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
      // Restore previous response
      const prevResponse = responses.find(r => r.stepId === config.steps[currentStepIndex - 1].id);
      if (prevResponse) {
        if (prevResponse.type === 'rating') {
          setCurrentRating(prevResponse.value as number);
        } else {
          setCurrentText(prevResponse.value as string);
        }
      }
    }
  };

  const renderRatingScale = () => {
    if (currentStep.type === 'nps') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-xs" style={{ color: config.textColor, opacity: 0.8 }}>
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
          <div className="flex gap-1">
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentRating(i)}
                className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                  currentRating === i
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                style={{ color: currentRating === i ? '#000' : config.textColor }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep.type === 'csat') {
      const ratings = ['😞', '😐', '🙂', '😊', '😍'];
      return (
        <div className="flex gap-2 justify-center">
          {ratings.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setCurrentRating(i)}
              className={`w-12 h-12 rounded-full text-2xl transition-all ${
                currentRating === i
                  ? 'bg-white/30 scale-110'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      );
    }

    return (
      <textarea
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        placeholder="Type your response..."
        className="w-full h-20 p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
        style={{ color: config.textColor }}
      />
    );
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-50`} style={{ zIndex: 50 + parseInt(config.id) }}>
      <div
        className="w-96 min-w-96 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 p-6"
        style={{ backgroundColor: config.backgroundColor }}
      >
        {config.showCloseButton && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" style={{ color: config.textColor }} />
          </button>
        )}

        <div className="space-y-4">
          {/* Progress indicator */}
          {config.steps.length > 1 && (
            <div className="flex justify-between items-center text-xs opacity-70">
              <span style={{ color: config.textColor }}>
                Step {currentStepIndex + 1} of {config.steps.length}
              </span>
              <div className="flex gap-1">
                {config.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStepIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <h3
            className="text-sm font-medium leading-relaxed"
            style={{ color: config.textColor }}
          >
            {currentStep.question}
          </h3>

          {renderRatingScale()}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            {!isFirstStep ? (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                style={{ color: config.textColor }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {canAdvance() && (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                style={{ color: config.textColor }}
              >
                <span>{isSubmitting ? 'Submitting...' : isLastStep ? 'Submit' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
