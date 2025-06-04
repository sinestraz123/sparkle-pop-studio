
import React, { useState, useEffect } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { NewsBuilderHeader } from './NewsBuilderHeader';
import { NewsContentSection } from './NewsContentSection';
import { NewsSettingsSection } from './NewsSettingsSection';
import { NewsPreview } from './NewsPreview';
import { NewsItem } from '@/hooks/useNews';

interface NewsBuilderProps {
  newsItem?: NewsItem;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const NewsBuilder: React.FC<NewsBuilderProps> = ({
  newsItem,
  onSave,
  onBack,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    status: 'draft',
    category: 'general',
  });

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || '',
        description: newsItem.description || '',
        content: newsItem.content || '',
        image_url: newsItem.image_url || '',
        status: newsItem.status || 'draft',
        category: newsItem.category || 'general',
      });
    }
  }, [newsItem]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleStatusChange = (status: string) => {
    updateFormData('status', status);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Builder */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        <NewsBuilderHeader
          formData={formData}
          isLoading={isLoading}
          onBack={onBack}
          onSave={handleSave}
          onStatusChange={handleStatusChange}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <Accordion type="multiple" defaultValue={["content", "settings"]} className="space-y-4">
            <NewsContentSection
              formData={formData}
              updateFormData={updateFormData}
            />
            <NewsSettingsSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </Accordion>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-gray-50">
        <NewsPreview formData={formData} />
      </div>
    </div>
  );
};
