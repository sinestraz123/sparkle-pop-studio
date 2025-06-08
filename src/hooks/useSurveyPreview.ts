
import { useState, useEffect } from 'react';

export const useSurveyPreview = (survey?: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, any>>({});

  // Reset to first question when survey changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setResponses({});
  }, [survey?.questions]);

  const questions = survey?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  return {
    currentQuestionIndex,
    currentQuestion,
    questions,
    responses,
    progress,
    handleNext,
    handlePrevious,
    handleResponse,
  };
};
