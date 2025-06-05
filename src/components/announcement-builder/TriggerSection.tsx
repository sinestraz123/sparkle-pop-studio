
import React from 'react';
import { Zap } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TriggerSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const TriggerSection: React.FC<TriggerSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const handleTriggerTypeChange = (value: string) => {
    updateFormData('trigger_type', value);
    // Reset auto_show when changing trigger type
    if (value !== 'auto_show') {
      updateFormData('auto_show', false);
    } else {
      updateFormData('auto_show', true);
    }
  };

  const renderTriggerSettings = () => {
    switch (formData.trigger_type || 'auto_show') {
      case 'auto_show':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Auto show</Label>
              <Switch
                checked={formData.auto_show}
                onCheckedChange={(checked) => updateFormData('auto_show', checked)}
              />
            </div>
            {formData.auto_show && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Delay (milliseconds)</Label>
                <Input
                  type="number"
                  value={formData.delay}
                  onChange={(e) => updateFormData('delay', parseInt(e.target.value) || 0)}
                  placeholder="2000"
                />
              </div>
            )}
          </div>
        );

      case 'time_on_page':
        return (
          <div>
            <Label className="text-sm font-medium mb-2 block">Time on page (seconds)</Label>
            <Input
              type="number"
              value={formData.delay / 1000}
              onChange={(e) => updateFormData('delay', (parseInt(e.target.value) || 0) * 1000)}
              placeholder="30"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">Show announcement after user spends this much time on page</p>
          </div>
        );

      case 'scroll_percent':
        return (
          <div>
            <Label className="text-sm font-medium mb-2 block">Scroll percentage</Label>
            <Input
              type="number"
              value={formData.delay}
              onChange={(e) => updateFormData('delay', parseInt(e.target.value) || 50)}
              placeholder="50"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">Show announcement when user scrolls this percentage of the page</p>
          </div>
        );

      case 'exit_intent':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Show announcement when user shows exit intent (moving mouse towards browser controls)</p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">✨ Smart trigger: Detects when users are about to leave</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AccordionItem value="trigger" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Smart Triggers</div>
            <div className="text-sm text-gray-500">When should it show?</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Trigger Type</Label>
          <Select
            value={formData.trigger_type || 'auto_show'}
            onValueChange={handleTriggerTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto_show">Auto Show (Time Delay)</SelectItem>
              <SelectItem value="time_on_page">Time on Page</SelectItem>
              <SelectItem value="scroll_percent">Scroll Percentage</SelectItem>
              <SelectItem value="exit_intent">Exit Intent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderTriggerSettings()}

        <div className="flex items-center justify-between border-t pt-4">
          <Label className="text-sm font-medium">Show close button</Label>
          <Switch
            checked={formData.show_close_button}
            onCheckedChange={(checked) => updateFormData('show_close_button', checked)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
