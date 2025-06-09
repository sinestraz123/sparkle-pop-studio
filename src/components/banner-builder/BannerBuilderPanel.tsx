
import { Banner } from '@/components/BannerBuilder';
import { BannerBuilderHeader } from './BannerBuilderHeader';
import { BannerContentSection } from './BannerContentSection';
import { BannerSettingsSection } from './BannerSettingsSection';
import { BannerActionsSection } from './BannerActionsSection';
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
        <BannerContentSection banner={banner} onBannerChange={onBannerChange} />
        <BannerSettingsSection banner={banner} onBannerChange={onBannerChange} />
        <BannerActionsSection banner={banner} onBannerChange={onBannerChange} />
        <BannerStyleSection banner={banner} onBannerChange={onBannerChange} />
      </div>
    </div>
  );
};
