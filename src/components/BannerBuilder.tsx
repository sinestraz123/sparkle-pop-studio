
import { useState, useEffect } from 'react';
import { BannerBuilderPanel } from '@/components/banner-builder/BannerBuilderPanel';
import { BannerPreview } from '@/components/BannerPreview';
import { Banner } from '@/types/banner';
import { useBanners } from '@/hooks/useBanners';
import { useAuth } from '@/hooks/useAuth';

interface BannerBuilderProps {
  initialBanner?: Banner | null;
  onSave?: () => void;
  onCancel?: () => void;
}

export const BannerBuilder = ({ initialBanner, onSave, onCancel }: BannerBuilderProps) => {
  const { user } = useAuth();
  const { saveBanner } = useBanners();
  const [banner, setBanner] = useState<Banner>({
    id: '',
    title: 'Join our webinar on 4th Nov 🚀📅',
    content: 'Discover amazing features and boost your productivity',
    background_color: '#000000',
    text_color: '#ffffff',
    button_text: 'Get Started',
    button_url: 'https://example.com',
    show_button: true,
    status: 'draft',
    position: 'top',
    width: 100,
    height: 60,
    views: 0,
    clicks: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: user?.id || '',
    show_sender: true,
    sender_name: 'Daniel from Glyph',
    sender_photo: '/lovable-uploads/fcfc67c6-7eb6-4f16-a061-ee4f6ddf1320.png',
    show_dismiss: true,
    style: 'floating',
    action_type: 'open_url_button'
  });

  useEffect(() => {
    if (initialBanner) {
      setBanner(initialBanner);
    }
  }, [initialBanner]);

  const handleBannerChange = (updates: Partial<Banner>) => {
    setBanner(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    const result = await saveBanner(banner);
    if (result && onSave) {
      onSave();
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto bg-white">
        <BannerBuilderPanel 
          banner={banner}
          onBannerChange={handleBannerChange}
          onSave={handleSave}
          onCancel={onCancel}
          isEditing={!!initialBanner}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-[400px] lg:min-h-0">
        <BannerPreview banner={banner} />
      </div>
    </div>
  );
};
