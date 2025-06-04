
import React from 'react';
import { Type, Upload } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContentSectionProps {
  formData: any;
  mediaType: 'image' | 'video' | 'none';
  updateFormData: (field: string, value: any) => void;
  onMediaTypeChange: (type: 'image' | 'video' | 'none') => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUrlChange: (url: string) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  mediaType,
  updateFormData,
  onMediaTypeChange,
  onImageUpload,
  onVideoUrlChange,
}) => {
  return (
    <AccordionItem value="content" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Type className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Content</div>
            <div className="text-sm text-gray-500">{formData.title}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Enter title"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        {/* Media Section */}
        <div>
          <label className="text-sm font-medium mb-3 block">Media</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { value: 'none', label: 'None', icon: '🚫' },
              { value: 'image', label: 'Image/GIF', icon: '🖼️' },
              { value: 'video', label: 'Video', icon: '🎥' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onMediaTypeChange(option.value as 'image' | 'video' | 'none')}
                className={`p-3 border rounded-lg text-center text-sm transition-colors ${
                  mediaType === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{option.icon}</div>
                <div className="font-medium text-xs">{option.label}</div>
              </button>
            ))}
          </div>

          {mediaType === 'image' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*,.gif"
                  onChange={onImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload image or GIF</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
              {formData.image_url && (
                <div className="text-xs text-green-600">✓ Image uploaded</div>
              )}
            </div>
          )}

          {mediaType === 'video' && (
            <div>
              <Input
                value={formData.video_url}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">Paste a video link from YouTube, Vimeo, or direct video URL</p>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Button Text</label>
          <Input
            value={formData.button_text}
            onChange={(e) => updateFormData('button_text', e.target.value)}
            placeholder="Enter button text"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Button URL</label>
          <Input
            value={formData.button_url}
            onChange={(e) => updateFormData('button_url', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Background</label>
            <Input
              type="color"
              value={formData.background_color}
              onChange={(e) => updateFormData('background_color', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Text Color</label>
            <Input
              type="color"
              value={formData.text_color}
              onChange={(e) => updateFormData('text_color', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Button Color</label>
          <Input
            type="color"
            value={formData.button_color}
            onChange={(e) => updateFormData('button_color', e.target.value)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
