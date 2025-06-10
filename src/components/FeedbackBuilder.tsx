
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FeedbackBuilderPanel } from '@/components/feedback-builder/FeedbackBuilderPanel';
import { FeedbackPreview } from '@/components/feedback-preview/FeedbackPreview';
import { useFeedback } from '@/hooks/useFeedback';

export interface FeedbackStep {
  id: string;
  type: 'nps' | 'csat' | 'short';
  question: string;
  required: boolean;
}

export interface FeedbackConfig {
  id: string;
  steps: FeedbackStep[];
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  position: 'bottom-left' | 'bottom-center' | 'bottom-right';
  showCloseButton: boolean;
  isActive: boolean;
}

export const FeedbackBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { feedbacks, updateFeedback, isLoading } = useFeedback();
  
  const currentFeedback = feedbacks.find(f => f.id === id);

  useEffect(() => {
    if (!isLoading && !currentFeedback && id) {
      // Redirect to feedback list if widget not found
      navigate('/feedback');
    }
  }, [currentFeedback, isLoading, id, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading feedback widget...</div>
      </div>
    );
  }

  if (!currentFeedback) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Feedback widget not found</div>
      </div>
    );
  }

  const handleConfigChange = (updates: Partial<FeedbackConfig>) => {
    updateFeedback(currentFeedback.id, updates);
  };

  const handleStepChange = (stepId: string, updates: Partial<FeedbackStep>) => {
    const updatedSteps = currentFeedback.steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    updateFeedback(currentFeedback.id, { steps: updatedSteps });
  };

  const handleAddStep = () => {
    const newStepId = Date.now().toString();
    const newStep: FeedbackStep = {
      id: newStepId,
      type: 'short',
      question: 'What else would you like to share?',
      required: false,
    };
    
    const updatedSteps = [...currentFeedback.steps, newStep];
    updateFeedback(currentFeedback.id, { steps: updatedSteps });
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = currentFeedback.steps.filter(step => step.id !== stepId);
    updateFeedback(currentFeedback.id, { steps: updatedSteps });
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <FeedbackBuilderPanel 
          configs={[currentFeedback]}
          selectedConfig={currentFeedback}
          selectedConfigId={currentFeedback.id}
          onConfigChange={handleConfigChange}
          onSelectConfig={() => {}} // Not needed for single widget
          onAddConfig={() => {}} // Not needed for single widget
          onDeleteConfig={() => {}} // Not needed for single widget
          onStepChange={handleStepChange}
          onAddStep={handleAddStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <FeedbackPreview configs={currentFeedback.isActive ? [currentFeedback] : []} />
      </div>
    </div>
  );
};
