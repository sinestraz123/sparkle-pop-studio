
import React, { useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AnnouncementPreview } from './AnnouncementPreview';
import { ScriptModal } from './ScriptModal';
import { BuilderHeader } from './announcement-builder/BuilderHeader';
import { SettingsSection } from './announcement-builder/SettingsSection';
import { ContentSection } from './announcement-builder/ContentSection';
import { TriggerSection } from './announcement-builder/TriggerSection';
import { ScriptSection } from './announcement-builder/ScriptSection';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

interface AnnouncementBuilderProps {
  announcement?: Announcement;
  onSave: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AnnouncementBuilder: React.FC<AnnouncementBuilderProps> = ({
  announcement,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || 'New: Chrome Extension',
    description: announcement?.description || 'Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.',
    type: announcement?.type || 'modal',
    position: announcement?.position || 'center',
    background_color: announcement?.background_color || '#ffffff',
    text_color: announcement?.text_color || '#000000',
    button_color: announcement?.button_color || '#000000',
    button_text: announcement?.button_text || 'Get the Chrome extension →',
    button_url: announcement?.button_url || '',
    image_url: announcement?.image_url || '',
    video_url: announcement?.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    show_close_button: announcement?.show_close_button ?? true,
    auto_show: announcement?.auto_show ?? true,
    delay: announcement?.delay || 2000,
    status: announcement?.status || 'draft',
  });

  const [showScript, setShowScript] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>(
    formData.video_url ? 'video' : formData.image_url ? 'image' : 'video'
  );

  const updateFormData = (field: string, value: any) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUrlChange = (url: string) => {
    updateFormData('video_url', url);
    updateFormData('image_url', '');
    setMediaType('video');
  };

  const handleMediaTypeChange = (type: 'image' | 'video' | 'none') => {
    setMediaType(type);
    if (type === 'none') {
      updateFormData('image_url', '');
      updateFormData('video_url', '');
    } else if (type === 'image' && !formData.image_url) {
      updateFormData('video_url', '');
    } else if (type === 'video' && !formData.video_url) {
      updateFormData('image_url', '');
    }
  };

  const handleSave = () => {
    console.log('Saving announcement with data:', formData);
    onSave(formData);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <BuilderHeader
          formData={formData}
          previewMode={previewMode}
          isLoading={isLoading}
          onBack={onBack}
          onPreviewToggle={setPreviewMode}
          onSave={handleSave}
          onStatusChange={(status) => updateFormData('status', status)}
        />

        {!previewMode && (
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["settings"]} className="space-y-4">
              <SettingsSection
                formData={formData}
                updateFormData={updateFormData}
              />

              <ContentSection
                formData={formData}
                mediaType={mediaType}
                updateFormData={updateFormData}
                onMediaTypeChange={handleMediaTypeChange}
                onImageUpload={() => {}} // This prop is no longer used but kept for compatibility
                onVideoUrlChange={handleVideoUrlChange}
              />

              <TriggerSection
                formData={formData}
                updateFormData={updateFormData}
              />

              <ScriptSection
                onShowScript={() => setShowScript(true)}
              />
            </Accordion>
          </div>
        )}
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-200 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
        
        <AnnouncementPreview announcement={formData} />
      </div>

      {/* Script Modal */}
      <ScriptModal 
        isOpen={showScript}
        onClose={() => setShowScript(false)}
        announcement={formData}
      />
    </div>
  );
};
