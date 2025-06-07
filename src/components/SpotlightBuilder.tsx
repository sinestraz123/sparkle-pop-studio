
import React, { useState, useEffect } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { SpotlightPreview } from './SpotlightPreview';
import { ScriptModal } from './ScriptModal';
import { SpotlightBuilderHeader } from './spotlight-builder/SpotlightBuilderHeader';
import { SpotlightContentSection } from './spotlight-builder/SpotlightContentSection';
import { SpotlightScriptSection } from './spotlight-builder/SpotlightScriptSection';
import { Tables } from '@/integrations/supabase/types';

type Spotlight = Tables<'spotlights'>;

interface SpotlightBuilderProps {
  spotlight?: Spotlight;
  onSave: (data: any) => Promise<any>;
  onBack: () => void;
  isLoading?: boolean;
}

export const SpotlightBuilder: React.FC<SpotlightBuilderProps> = ({
  spotlight,
  onSave,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: 'New Product Demo',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'draft',
  });

  const [showScript, setShowScript] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedSpotlight, setSavedSpotlight] = useState(spotlight);

  useEffect(() => {
    if (spotlight) {
      console.log('Loading spotlight data:', spotlight);
      const loadedData = {
        title: spotlight.title || 'New Product Demo',
        video_url: spotlight.video_url || '',
        status: spotlight.status || 'draft',
      };
      setFormData(loadedData);
    }
  }, [spotlight]);

  const updateFormData = (field: string, value: any) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log('Saving spotlight with data:', formData);
    try {
      const result = await onSave(formData);
      if (result && result.id) {
        setSavedSpotlight(result);
      }
    } catch (error) {
      console.error('Error saving spotlight:', error);
    }
  };

  const spotlightForScript = savedSpotlight && savedSpotlight.id 
    ? savedSpotlight 
    : { ...formData, id: spotlight?.id };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Configuration */}
      <div className="w-[480px] bg-white border-r border-gray-200 overflow-y-auto">
        <SpotlightBuilderHeader
          title={formData.title}
          previewMode={previewMode}
          isLoading={isLoading}
          onBack={onBack}
          onPreviewToggle={setPreviewMode}
          onSave={handleSave}
          status={formData.status}
          onStatusChange={(status) => updateFormData('status', status)}
        />

        {!previewMode && (
          <div className="p-6">
            <Accordion type="multiple" defaultValue={["content"]} className="space-y-4">
              <SpotlightContentSection
                title={formData.title}
                videoUrl={formData.video_url}
                onTitleChange={(title) => updateFormData('title', title)}
                onVideoUrlChange={(video_url) => updateFormData('video_url', video_url)}
              />

              <SpotlightScriptSection
                onShowScript={() => setShowScript(true)}
              />
            </Accordion>
          </div>
        )}
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-600">
          yourwebsite.com
        </div>
        
        <SpotlightPreview spotlight={formData} />
      </div>

      {/* Script Modal */}
      <ScriptModal 
        isOpen={showScript}
        onClose={() => setShowScript(false)}
        announcement={spotlightForScript}
      />
    </div>
  );
};
