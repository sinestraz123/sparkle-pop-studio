
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { ChecklistPreview } from './ChecklistPreview';
import { ChecklistBuilderHeader } from './checklist-builder/ChecklistBuilderHeader';
import { ChecklistSettingsSection } from './checklist-builder/ChecklistSettingsSection';
import { ChecklistContentSection } from './checklist-builder/ChecklistContentSection';
import { ChecklistItemsSection } from './checklist-builder/ChecklistItemsSection';
import { ChecklistTriggerSection } from './checklist-builder/ChecklistTriggerSection';
import { ChecklistWithItems } from '@/hooks/useChecklists';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'none' | 'image' | 'gif' | 'url';
  media_url?: string;
}

interface ChecklistFormData {
  title: string;
  description: string;
  show_progress: boolean;
  progress_bar_color: string;
  button_text: string;
  button_url: string;
  auto_hide: boolean;
  status: string;
  items: ChecklistItem[];
}

interface ChecklistBuilderProps {
  checklist?: ChecklistWithItems;
  onSave: (data: ChecklistFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const ChecklistBuilder: React.FC<ChecklistBuilderProps> = ({
  checklist,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ChecklistFormData>({
    title: checklist?.title || 'Getting Started',
    description: checklist?.description || 'Complete these steps to get started with our platform',
    show_progress: checklist?.show_progress ?? true,
    progress_bar_color: checklist?.progress_bar_color || '#3b82f6',
    button_text: checklist?.button_text || 'Get Started',
    button_url: checklist?.button_url || '#',
    auto_hide: checklist?.auto_hide ?? false,
    status: checklist?.status || 'draft',
    items: checklist?.checklist_items?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      media_type: item.media_type as 'none' | 'image' | 'gif' | 'url',
      media_url: item.media_url || '',
    })) || [
      {
        id: '1',
        title: 'Get the Chrome extension',
        description: 'Install our Chrome extension to start capturing leads',
        media_type: 'none' as const,
        media_url: '',
      },
      {
        id: '2',
        title: 'Invite your team',
        description: 'Add team members to collaborate on lead generation',
        media_type: 'none' as const,
        media_url: '',
      },
    ],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: 'New checklist item',
      description: '',
      media_type: 'none',
      media_url: '',
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <ChecklistBuilderHeader
          formData={formData}
          isLoading={isLoading}
          onBack={onBack}
          onSave={handleSave}
          onStatusChange={(status) => updateFormData('status', status)}
        />

        <div className="p-6">
          <Accordion type="multiple" defaultValue={["content"]} className="space-y-4">
            <ChecklistSettingsSection
              formData={formData}
              updateFormData={updateFormData}
            />

            <ChecklistContentSection
              formData={formData}
              updateFormData={updateFormData}
            />

            <ChecklistItemsSection
              items={formData.items}
              updateItem={updateItem}
              addItem={addItem}
              removeItem={removeItem}
            />

            <ChecklistTriggerSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </Accordion>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
        
        <ChecklistPreview config={formData} />
      </div>
    </div>
  );
};
