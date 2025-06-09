
import { useState } from 'react';
import { BannerBuilderPanel } from '@/components/banner-builder/BannerBuilderPanel';
import { BannerPreview } from '@/components/BannerPreview';

export interface Banner {
  id: string;
  title: string;
  content: string;
  background_color: string;
  text_color: string;
  button_text: string;
  button_url: string;
  show_button: boolean;
  status: string;
  position: string;
  width: number;
  height: number;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const BannerBuilder = () => {
  const [banner, setBanner] = useState<Banner>({
    id: '1',
    title: 'Welcome to our platform',
    content: 'Discover amazing features and boost your productivity',
    background_color: '#2563eb',
    text_color: '#ffffff',
    button_text: 'Get Started',
    button_url: 'https://example.com',
    show_button: true,
    status: 'draft',
    position: 'top',
    width: 193,
    height: 63,
    views: 0,
    clicks: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: ''
  });

  const handleBannerChange = (updates: Partial<Banner>) => {
    setBanner(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-screen flex">
      <div className="w-[480px] border-r border-gray-200 overflow-y-auto">
        <BannerBuilderPanel 
          banner={banner}
          onBannerChange={handleBannerChange}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <BannerPreview banner={banner} />
      </div>
    </div>
  );
};
