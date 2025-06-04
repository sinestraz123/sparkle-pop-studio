
import React from 'react';
import { Palette } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface SurveyDisplaySectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const SurveyDisplaySection: React.FC<SurveyDisplaySectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <AccordionItem value="display" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Display & Styling</div>
            <div className="text-sm text-gray-500">How should the survey appear?</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
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
            </SelectContent>
          </Select>
        </div>

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

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Background Color</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.background_color}
                onChange={(e) => updateFormData('background_color', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={formData.background_color}
                onChange={(e) => updateFormData('background_color', e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Text Color</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.text_color}
                onChange={(e) => updateFormData('text_color', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={formData.text_color}
                onChange={(e) => updateFormData('text_color', e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Button Color</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.button_color}
                onChange={(e) => updateFormData('button_color', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={formData.button_color}
                onChange={(e) => updateFormData('button_color', e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
