
import { Banner } from '@/types/banner';
import { BannerBuilderHeader } from './BannerBuilderHeader';
import { BannerSettingsSection } from './BannerSettingsSection';
import { BannerActionSection } from './BannerActionSection';
import { BannerStyleSection } from './BannerStyleSection';

interface BannerBuilderPanelProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerBuilderPanel = ({ banner, onBannerChange }: BannerBuilderPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      <BannerBuilderHeader banner={banner} onBannerChange={onBannerChange} />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <BannerSettingsSection banner={banner} onBannerChange={onBannerChange} />
        <BannerActionSection banner={banner} onBannerChange={onBannerChange} />
        <BannerStyleSection banner={banner} onBannerChange={onBannerChange} />
      </div>
    </div>
  );
};
