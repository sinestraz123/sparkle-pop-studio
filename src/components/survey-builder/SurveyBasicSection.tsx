
import React from 'react';
import { FileText } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SurveyBasicSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const SurveyBasicSection: React.FC<SurveyBasicSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="basic" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Basic Information</div>
            <div className="text-sm text-gray-500">Survey title and description</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Survey Title</label>
          <Input
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Enter survey title..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Enter survey description..."
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Submit Button Text</label>
          <Input
            value={formData.submit_button_text}
            onChange={(e) => updateFormData('submit_button_text', e.target.value)}
            placeholder="Submit Survey"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
