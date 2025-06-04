
import React from 'react';
import { Settings } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface ChecklistSettingsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const ChecklistSettingsSection: React.FC<ChecklistSettingsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="settings" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Settings</div>
            <div className="text-sm text-gray-500">Configure checklist display options</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Progress Bar</label>
          <Switch
            checked={formData.show_progress}
            onCheckedChange={(checked) => updateFormData('show_progress', checked)}
          />
        </div>

        {formData.show_progress && (
          <div>
            <label className="text-sm font-medium mb-2 block">Progress Bar Color</label>
            <div className="flex items-center space-x-2">
              <Input 
                type="color"
                value={formData.progress_bar_color}
                onChange={(e) => updateFormData('progress_bar_color', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input 
                value={formData.progress_bar_color}
                onChange={(e) => updateFormData('progress_bar_color', e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Auto Hide on Completion</label>
          <Switch
            checked={formData.auto_hide}
            onCheckedChange={(checked) => updateFormData('auto_hide', checked)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
