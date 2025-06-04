
import React from 'react';
import { Type, Upload } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNewsImageUpload } from '@/hooks/useNewsImageUpload';

interface NewsContentSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export const NewsContentSection: React.FC<NewsContentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const { uploadImage, isUploading } = useNewsImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        updateFormData('image_url', imageUrl);
      }
    }
  };

  return (
    <AccordionItem value="content" className="border rounded-lg px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Type className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Content</div>
            <div className="text-sm text-gray-500">{formData.title || 'Add news content'}</div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Enter news title"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Enter a brief description"
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Full Content</label>
          <Textarea
            value={formData.content}
            onChange={(e) => updateFormData('content', e.target.value)}
            placeholder="Enter the full news content"
            rows={5}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bugfix">Bug Fix</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Image</label>
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full max-w-xs rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
