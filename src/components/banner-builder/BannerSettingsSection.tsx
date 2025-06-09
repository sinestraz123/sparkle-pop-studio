
import { Banner } from '@/types/banner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';

interface BannerSettingsSectionProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerSettingsSection = ({ banner, onBannerChange }: BannerSettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Uploading sender photo:', file.name);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      console.log('Sender photo uploaded successfully:', imageUrl);
      onBannerChange({ sender_photo: imageUrl });
    }
  };

  const removeSenderPhoto = () => {
    onBannerChange({ sender_photo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Settings className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">Settings</div>
            <div className="text-sm text-gray-500">Basic banner configuration</div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
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
          <>
            <div className="space-y-2">
              <Label htmlFor="sender-name">Sender name</Label>
              <Input
                id="sender-name"
                value={banner.sender_name}
                onChange={(e) => onBannerChange({ sender_name: e.target.value })}
                placeholder="Sender name"
              />
            </div>

            <div className="space-y-2">
              <Label>Sender photo</Label>
              <div className="flex items-center space-x-3">
                {banner.sender_photo ? (
                  <div className="relative">
                    <img
                      src={banner.sender_photo}
                      alt="Sender"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button
                      onClick={removeSenderPhoto}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No photo</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload photo'}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Upload a square image for best results</p>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="show-dismiss">Show a dismiss button</Label>
          <Switch
            id="show-dismiss"
            checked={banner.show_dismiss}
            onCheckedChange={(checked) => onBannerChange({ show_dismiss: checked })}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
