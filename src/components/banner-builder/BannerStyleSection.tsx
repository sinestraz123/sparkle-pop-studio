
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface BannerStyleSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerStyleSection = ({ banner, onBannerChange }: BannerStyleSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Style</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Display Style</Label>
          <ToggleGroup 
            type="single" 
            value={banner.style} 
            onValueChange={(value: Banner['style']) => value && onBannerChange({ style: value })}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="inline" className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400"></div>
              Inline
            </ToggleGroupItem>
            <ToggleGroupItem value="floating" className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              Floating
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <ToggleGroup 
            type="single" 
            value={banner.position} 
            onValueChange={(value: Banner['position']) => value && onBannerChange({ position: value })}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="top" className="flex items-center gap-2">
              ↑ Top
            </ToggleGroupItem>
            <ToggleGroupItem value="bottom" className="flex items-center gap-2">
              ↓ Bottom
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background color</Label>
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
              placeholder="#0071B2"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Text color</Label>
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
      </div>
    </div>
  );
};
