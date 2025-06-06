
// Re-export all survey hooks for backward compatibility
export { useSurveysList as useSurveys } from './useSurveysList';
export { useSingleSurvey as useSurvey } from './useSingleSurvey';
export { useSurveyQuestionsManager as useSurveyQuestions } from './useSurveyQuestionsManager';

// Also export with the original names for existing imports
export { useSurveysList } from './useSurveysList';
export { useSingleSurvey } from './useSingleSurvey';
export { useSurveyQuestionsManager } from './useSurveyQuestionsManager';
