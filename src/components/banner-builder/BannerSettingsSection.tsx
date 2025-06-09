
import { Banner } from '@/components/BannerBuilder';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BannerSettingsSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerSettingsSection = ({ banner, onBannerChange }: BannerSettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-semibold text-gray-900">Settings</h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-button">Show floating button</Label>
          <Switch
            id="show-button"
            checked={banner.show_button}
            onCheckedChange={(checked) => onBannerChange({ show_button: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select value={banner.position} onValueChange={(value) => onBannerChange({ position: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="center">Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
