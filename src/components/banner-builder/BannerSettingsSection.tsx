
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerSettingsSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerSettingsSection = ({ banner, onBannerChange }: BannerSettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            value={banner.title}
            onChange={(e) => onBannerChange({ title: e.target.value })}
            placeholder="Your message..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="show-sender">Show sender</Label>
          <Select 
            value={banner.show_sender ? 'show' : 'hide'} 
            onValueChange={(value) => onBannerChange({ show_sender: value === 'show' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show">Show sender</SelectItem>
              <SelectItem value="hide">Hide sender</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {banner.show_sender && (
          <div className="space-y-2">
            <Label htmlFor="sender-name">Sender name</Label>
            <Input
              id="sender-name"
              value={banner.sender_name}
              onChange={(e) => onBannerChange({ sender_name: e.target.value })}
              placeholder="Sender name"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="show-dismiss">Show a dismiss button</Label>
          <Switch
            id="show-dismiss"
            checked={banner.show_dismiss}
            onCheckedChange={(checked) => onBannerChange({ show_dismiss: checked })}
          />
        </div>
      </div>
    </div>
  );
};
