
import React from 'react';
import { Settings } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsSettingsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const NewsSettingsSection: React.FC<NewsSettingsSectionProps> = ({
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
            <div className="text-sm text-gray-500">Configure news display options</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bugfix">Bug Fix</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Published news items will be visible to all users. Draft items are only visible to you.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
