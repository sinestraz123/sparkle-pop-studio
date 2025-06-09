
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MousePointer } from 'lucide-react';
import { useState } from 'react';

interface BannerActionSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerActionSection = ({ banner, onBannerChange }: BannerActionSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <MousePointer className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">Action</div>
            <div className="text-sm text-gray-500">Configure banner interactions</div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
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
              <SelectItem value="open_url_button">Show button with URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {banner.action_type === 'open_url_button' && (
          <>
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

            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={banner.button_text}
                onChange={(e) => onBannerChange({ button_text: e.target.value })}
                placeholder="Get Started"
              />
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
