
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
  const [feedbackConfigs, setFeedbackConfigs] = useState<FeedbackConfig[]>([
    {
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
    }
  ]);

  const [selectedConfigId, setSelectedConfigId] = useState<string>('1');

  const handleConfigChange = (updates: Partial<FeedbackConfig>) => {
    setFeedbackConfigs(prev => 
      prev.map(config => 
        config.id === selectedConfigId 
          ? { ...config, ...updates }
          : config
      )
    );
  };

  const handleStepChange = (stepId: string, updates: Partial<FeedbackStep>) => {
    setFeedbackConfigs(prev => 
      prev.map(config => 
        config.id === selectedConfigId 
          ? {
              ...config,
              steps: config.steps.map(step => 
                step.id === stepId ? { ...step, ...updates } : step
              )
            }
          : config
      )
    );
  };

  const handleAddStep = () => {
    const newStepId = Date.now().toString();
    const newStep: FeedbackStep = {
      id: newStepId,
      type: 'short',
      question: 'What else would you like to share?',
      required: false,
    };
    
    setFeedbackConfigs(prev => 
      prev.map(config => 
        config.id === selectedConfigId 
          ? { ...config, steps: [...config.steps, newStep] }
          : config
      )
    );
  };

  const handleDeleteStep = (stepId: string) => {
    setFeedbackConfigs(prev => 
      prev.map(config => 
        config.id === selectedConfigId 
          ? { ...config, steps: config.steps.filter(step => step.id !== stepId) }
          : config
      )
    );
  };

  const handleAddConfig = () => {
    const newId = Date.now().toString();
    const newConfig: FeedbackConfig = {
      id: newId,
      steps: [
        {
          id: 'step1',
          type: 'nps',
          question: 'How likely are you to recommend us to a friend?',
          required: true,
        }
      ],
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      buttonColor: '#ffffff',
      position: 'bottom-center',
      showCloseButton: true,
      isActive: true,
    };
    
    setFeedbackConfigs(prev => [...prev, newConfig]);
    setSelectedConfigId(newId);
  };

  const handleDeleteConfig = (configId: string) => {
    if (feedbackConfigs.length <= 1) return;
    
    setFeedbackConfigs(prev => prev.filter(config => config.id !== configId));
    
    if (selectedConfigId === configId) {
      const remainingConfigs = feedbackConfigs.filter(config => config.id !== configId);
      setSelectedConfigId(remainingConfigs[0]?.id || '');
    }
  };

  const selectedConfig = feedbackConfigs.find(config => config.id === selectedConfigId);

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
        <FeedbackBuilderPanel 
          configs={feedbackConfigs}
          selectedConfig={selectedConfig}
          selectedConfigId={selectedConfigId}
          onConfigChange={handleConfigChange}
          onSelectConfig={setSelectedConfigId}
          onAddConfig={handleAddConfig}
          onDeleteConfig={handleDeleteConfig}
          onStepChange={handleStepChange}
          onAddStep={handleAddStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100">
        <FeedbackPreview configs={feedbackConfigs.filter(config => config.isActive)} />
      </div>
    </div>
  );
};
