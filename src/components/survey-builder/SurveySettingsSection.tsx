
import React from 'react';
import { Settings } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SurveySettingsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const SurveySettingsSection: React.FC<SurveySettingsSectionProps> = ({
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
            <div className="text-sm text-gray-500">How should the survey be positioned?</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div>
          <label className="text-sm font-medium mb-3 block">Form Factor</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'modal', label: 'Modal', icon: '📱' },
              { value: 'popover', label: 'Popover', icon: '💬' },
              { value: 'banner', label: 'Pin', icon: '📌' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData('type', option.value)}
                className={`p-4 border rounded-lg text-center text-sm transition-colors ${
                  formData.type === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Position</label>
          <Select value={formData.position} onValueChange={(value) => updateFormData('position', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="corner">Corner</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
