
import { Banner } from '@/components/BannerBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BannerStyleSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerStyleSection = ({ banner, onBannerChange }: BannerStyleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-semibold text-gray-900">Style</h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="background-color"
              type="color"
              value={banner.background_color}
              onChange={(e) => onBannerChange({ background_color: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={banner.background_color}
              onChange={(e) => onBannerChange({ background_color: e.target.value })}
              placeholder="#2563eb"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="text-color"
              type="color"
              value={banner.text_color}
              onChange={(e) => onBannerChange({ text_color: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={banner.text_color}
              onChange={(e) => onBannerChange({ text_color: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
