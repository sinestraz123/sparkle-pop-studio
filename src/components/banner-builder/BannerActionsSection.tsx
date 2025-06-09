
import { Banner } from '@/components/BannerBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BannerActionsSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerActionsSection = ({ banner, onBannerChange }: BannerActionsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-semibold text-gray-900">Actions</h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="button-url">Button URL</Label>
          <Input
            id="button-url"
            type="url"
            value={banner.button_url}
            onChange={(e) => onBannerChange({ button_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
