
import React from 'react';
import { Zap } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';

interface ChecklistTriggerSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const ChecklistTriggerSection: React.FC<ChecklistTriggerSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="trigger" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Zap className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Trigger</div>
            <div className="text-sm text-gray-500">When does it show?</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Auto Hide on Completion</label>
          <Switch
            checked={formData.auto_hide}
            onCheckedChange={(checked) => updateFormData('auto_hide', checked)}
          />
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Checklists appear when users visit your application and remain visible until completed or manually dismissed.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
