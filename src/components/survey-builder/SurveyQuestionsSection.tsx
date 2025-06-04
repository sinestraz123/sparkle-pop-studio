
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SurveyQuestionsBuilder } from './SurveyQuestionsBuilder';

interface SurveyQuestionsSectionProps {
  surveyId: string;
  questions: any[];
}

export const SurveyQuestionsSection: React.FC<SurveyQuestionsSectionProps> = ({
  surveyId,
  questions,
}) => {
  return (
    <AccordionItem value="questions" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <HelpCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Questions</div>
            <div className="text-sm text-gray-500">{questions.length} questions added</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <SurveyQuestionsBuilder surveyId={surveyId} questions={questions} />
      </AccordionContent>
    </AccordionItem>
  );
};
