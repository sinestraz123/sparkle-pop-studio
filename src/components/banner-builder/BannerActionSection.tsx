
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerActionSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerActionSection = ({ banner, onBannerChange }: BannerActionSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Action</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="action-type">Action type</Label>
          <Select 
            value={banner.action_type} 
            onValueChange={(value: Banner['action_type']) => onBannerChange({ action_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="open_url">Open a URL</SelectItem>
              <SelectItem value="open_url_button">
                <div className="flex items-center gap-2">
                  Open a URL via a button
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">New</span>
                </div>
              </SelectItem>
              <SelectItem value="ask_reactions">Ask for reactions</SelectItem>
              <SelectItem value="collect_emails">Collect visitor emails</SelectItem>
              <SelectItem value="product_tour">Launch a Product Tour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(banner.action_type === 'open_url' || banner.action_type === 'open_url_button') && (
          <div className="space-y-2">
            <Label htmlFor="button-url">URL</Label>
            <Input
              id="button-url"
              type="url"
              value={banner.button_url}
              onChange={(e) => onBannerChange({ button_url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}

        {banner.action_type === 'open_url_button' && (
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={banner.button_text}
              onChange={(e) => onBannerChange({ button_text: e.target.value })}
              placeholder="Get Started"
            />
          </div>
        )}
      </div>
    </div>
  );
};
