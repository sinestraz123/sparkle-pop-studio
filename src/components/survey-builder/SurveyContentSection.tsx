
import React from 'react';
import { Type } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SurveyContentSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const SurveyContentSection: React.FC<SurveyContentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="content" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Type className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Content</div>
            <div className="text-sm text-gray-500">{formData.title}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Enter survey title"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Enter survey description"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Submit Button Text</label>
          <Input
            value={formData.submit_button_text}
            onChange={(e) => updateFormData('submit_button_text', e.target.value)}
            placeholder="Submit"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Button Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.button_color}
              onChange={(e) => updateFormData('button_color', e.target.value)}
              className="w-12 h-10 p-1 border"
            />
            <Input
              value={formData.button_color}
              onChange={(e) => updateFormData('button_color', e.target.value)}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
