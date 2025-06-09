
import { useState } from 'react';
import { FeedbackBuilderPanel } from '@/components/feedback-builder/FeedbackBuilderPanel';
import { FeedbackPreview } from '@/components/feedback-preview/FeedbackPreview';

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
  const [feedbackConfig, setFeedbackConfig] = useState<FeedbackConfig>({
    id: '1',
    steps: [
      {
        id: 'step1',
        type: 'nps',
        question: 'How likely are you to recommend us to a friend?',
        required: true,
      },
      {
        id: 'step2',
        type: 'short',
        question: "We're sorry to hear that. What could we have done differently to improve your experience?",
        required: false,
      }
    ],
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
    buttonColor: '#ffffff',
    position: 'bottom-center',
    showCloseButton: true,
    isActive: true,
  });

  const handleConfigChange = (updates: Partial<FeedbackConfig>) => {
    setFeedbackConfig(prev => ({ ...prev, ...updates }));
  };

  const handleStepChange = (stepId: string, updates: Partial<FeedbackStep>) => {
    setFeedbackConfig(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const handleAddStep = () => {
    const newStepId = Date.now().toString();
    const newStep: FeedbackStep = {
      id: newStepId,
      type: 'short',
      question: 'What else would you like to share?',
      required: false,
    };
    
    setFeedbackConfig(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleDeleteStep = (stepId: string) => {
    setFeedbackConfig(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <FeedbackBuilderPanel 
          configs={[feedbackConfig]}
          selectedConfig={feedbackConfig}
          selectedConfigId={feedbackConfig.id}
          onConfigChange={handleConfigChange}
          onSelectConfig={() => {}}
          onAddConfig={() => {}}
          onDeleteConfig={() => {}}
          onStepChange={handleStepChange}
          onAddStep={handleAddStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <FeedbackPreview configs={[feedbackConfig]} />
      </div>
    </div>
  );
};
