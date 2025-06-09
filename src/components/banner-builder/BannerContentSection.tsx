
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BannerContentSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerContentSection = ({ banner, onBannerChange }: BannerContentSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <h3 className="font-semibold text-gray-900">Content</h3>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={banner.title}
            onChange={(e) => onBannerChange({ title: e.target.value })}
            placeholder="Enter banner title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={banner.content}
            onChange={(e) => onBannerChange({ content: e.target.value })}
            placeholder="Enter banner content"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={banner.button_text}
            onChange={(e) => onBannerChange({ button_text: e.target.value })}
            placeholder="Enter button text"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
