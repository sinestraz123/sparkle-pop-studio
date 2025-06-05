
import React, { useState, useEffect } from 'react';
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
  onSave: (data: any) => Promise<any>;
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
    title: 'New: Chrome Extension',
    description: 'Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.',
    type: 'modal',
    position: 'center',
    background_color: '#ffffff',
    text_color: '#000000',
    button_color: '#000000',
    button_text: 'Get the Chrome extension →',
    button_url: '',
    button_action: 'url',
    image_url: '',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    show_close_button: true,
    auto_show: true,
    delay: 2000,
    status: 'draft',
    trigger_type: 'auto_show',
  });

  const [showScript, setShowScript] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('video');
  const [savedAnnouncement, setSavedAnnouncement] = useState(announcement);

  // Initialize form data from announcement prop when component mounts or announcement changes
  useEffect(() => {
    if (announcement) {
      console.log('Loading announcement data:', announcement);
      const loadedData = {
        title: announcement.title || 'New: Chrome Extension',
        description: announcement.description || 'Now you can create leads directly from LinkedIn – or anywhere you find your next prospect.',
        type: announcement.type || 'modal',
        position: announcement.position || 'center',
        background_color: announcement.background_color || '#ffffff',
        text_color: announcement.text_color || '#000000',
        button_color: announcement.button_color || '#000000',
        button_text: announcement.button_text || 'Get the Chrome extension →',
        button_url: announcement.button_url || '',
        button_action: announcement.button_action || 'url',
        image_url: announcement.image_url || '',
        video_url: announcement.video_url || '',
        show_close_button: announcement.show_close_button ?? true,
        auto_show: announcement.auto_show ?? true,
        delay: announcement.delay || 2000,
        status: announcement.status || 'draft',
        trigger_type: announcement.trigger_type || 'auto_show',
      };
      
      setFormData(loadedData);
      
      // Set correct media type based on loaded data
      if (loadedData.image_url && loadedData.image_url.trim() !== '') {
        setMediaType('image');
      } else if (loadedData.video_url && loadedData.video_url.trim() !== '') {
        setMediaType('video');
      } else {
        setMediaType('none');
      }
    }
  }, [announcement]);

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

  const handleSave = async () => {
    console.log('Saving announcement with data:', formData);
    try {
      const result = await onSave(formData);
      // If the save was successful and returned an announcement with ID
      if (result && result.id) {
        setSavedAnnouncement(result);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  // Use savedAnnouncement for the script modal if available, otherwise use the current formData
  const announcementForScript = savedAnnouncement && savedAnnouncement.id 
    ? savedAnnouncement 
    : { ...formData, id: announcement?.id };

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
        announcement={announcementForScript}
      />
    </div>
  );
};
