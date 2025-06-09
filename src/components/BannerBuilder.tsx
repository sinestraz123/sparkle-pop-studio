
import { useState } from 'react';
import { BannerBuilderPanel } from '@/components/banner-builder/BannerBuilderPanel';
import { BannerPreview } from '@/components/BannerPreview';
import { Banner } from '@/types/banner';

export const BannerBuilder = () => {
  const [banner, setBanner] = useState<Banner>({
    id: '1',
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
    user_id: '',
    show_sender: true,
    sender_name: 'Daniel from Glyph',
    show_dismiss: true,
    style: 'floating',
    action_type: 'open_url_button'
  });

  const handleBannerChange = (updates: Partial<Banner>) => {
    setBanner(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto bg-white">
        <BannerBuilderPanel 
          banner={banner}
          onBannerChange={handleBannerChange}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-[400px] lg:min-h-0">
        <BannerPreview banner={banner} />
      </div>
    </div>
  );
};
