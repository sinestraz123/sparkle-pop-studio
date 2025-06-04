
import React from 'react';
import { Zap } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface TriggerSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const TriggerSection: React.FC<TriggerSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="trigger" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Trigger</div>
            <div className="text-sm text-gray-500">When does it show?</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Auto show</label>
          <Switch
            checked={formData.auto_show}
            onCheckedChange={(checked) => updateFormData('auto_show', checked)}
          />
        </div>

        {formData.auto_show && (
          <div>
            <label className="text-sm font-medium mb-2 block">Delay (milliseconds)</label>
            <Input
              type="number"
              value={formData.delay}
              onChange={(e) => updateFormData('delay', parseInt(e.target.value) || 0)}
              placeholder="2000"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show close button</label>
          <Switch
            checked={formData.show_close_button}
            onCheckedChange={(checked) => updateFormData('show_close_button', checked)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
