
import { useState } from 'react';
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
  const { feedbacks, addFeedback, updateFeedback, deleteFeedback, saveFeedback } = useFeedback();
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

  // Initialize with one feedback if none exist
  if (feedbacks.length === 0) {
    const initialFeedback = addFeedback();
    setSelectedFeedbackId(initialFeedback.id);
  }

  const selectedFeedback = feedbacks.find(f => f.id === selectedFeedbackId) || feedbacks[0];

  const handleConfigChange = (updates: Partial<FeedbackConfig>) => {
    if (selectedFeedback) {
      updateFeedback(selectedFeedback.id, updates);
    }
  };

  const handleStepChange = (stepId: string, updates: Partial<FeedbackStep>) => {
    if (selectedFeedback) {
      const updatedSteps = selectedFeedback.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      );
      updateFeedback(selectedFeedback.id, { steps: updatedSteps });
    }
  };

  const handleAddStep = () => {
    if (selectedFeedback) {
      const newStepId = Date.now().toString();
      const newStep: FeedbackStep = {
        id: newStepId,
        type: 'short',
        question: 'What else would you like to share?',
        required: false,
      };
      
      const updatedSteps = [...selectedFeedback.steps, newStep];
      updateFeedback(selectedFeedback.id, { steps: updatedSteps });
    }
  };

  const handleDeleteStep = (stepId: string) => {
    if (selectedFeedback) {
      const updatedSteps = selectedFeedback.steps.filter(step => step.id !== stepId);
      updateFeedback(selectedFeedback.id, { steps: updatedSteps });
    }
  };

  const handleSelectConfig = (configId: string) => {
    setSelectedFeedbackId(configId);
  };

  const handleAddConfig = () => {
    const newFeedback = addFeedback();
    setSelectedFeedbackId(newFeedback.id);
  };

  const handleDeleteConfig = (configId: string) => {
    deleteFeedback(configId);
    if (selectedFeedbackId === configId) {
      setSelectedFeedbackId(feedbacks.length > 1 ? feedbacks[0].id : null);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <FeedbackBuilderPanel 
          configs={feedbacks}
          selectedConfig={selectedFeedback}
          selectedConfigId={selectedFeedbackId || ''}
          onConfigChange={handleConfigChange}
          onSelectConfig={handleSelectConfig}
          onAddConfig={handleAddConfig}
          onDeleteConfig={handleDeleteConfig}
          onStepChange={handleStepChange}
          onAddStep={handleAddStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <FeedbackPreview configs={feedbacks.filter(f => f.isActive)} />
      </div>
    </div>
  );
};
