
import { useState } from 'react';
import { FeedbackBuilderPanel } from '@/components/feedback-builder/FeedbackBuilderPanel';
import { FeedbackPreview } from '@/components/feedback-preview/FeedbackPreview';

export const FeedbackBuilder = () => {
  const [feedbackConfig, setFeedbackConfig] = useState({
    type: 'nps',
    question: "We're sorry to hear that. What could we have done differently to improve your experience?",
    backgroundColor: '#2563eb',
    textColor: '#ffffff',
    buttonColor: '#ffffff',
    position: 'bottom-center',
    showCloseButton: true,
  });

  const handleConfigChange = (updates: any) => {
    setFeedbackConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <FeedbackBuilderPanel 
          config={feedbackConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <FeedbackPreview config={feedbackConfig} />
      </div>
    </div>
  );
};
