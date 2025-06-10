
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackConfig } from '@/components/FeedbackBuilder';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackConfig[]>([]);
  const { toast } = useToast();

  const createFeedback = (): FeedbackConfig => {
    const newFeedback: FeedbackConfig = {
      id: Date.now().toString(),
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
    return newFeedback;
  };

  const addFeedback = () => {
    const newFeedback = createFeedback();
    setFeedbacks(prev => [...prev, newFeedback]);
    toast({
      title: "Success",
      description: "New feedback widget created",
    });
    return newFeedback;
  };

  const updateFeedback = (feedbackId: string, updates: Partial<FeedbackConfig>) => {
    setFeedbacks(prev => 
      prev.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, ...updates } : feedback
      )
    );
  };

  const deleteFeedback = (feedbackId: string) => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackId));
    toast({
      title: "Success",
      description: "Feedback widget deleted",
    });
  };

  const saveFeedback = async (feedback: FeedbackConfig) => {
    // Here you would typically save to a database
    console.log('Saving feedback:', feedback);
    toast({
      title: "Success",
      description: "Feedback widget saved",
    });
    return true;
  };

  return {
    feedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    saveFeedback,
  };
};
