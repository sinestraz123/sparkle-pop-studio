
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { NewsItem } from '@/hooks/useNews';
import { useNewsImageUpload } from '@/hooks/useNewsImageUpload';

interface NewsFormProps {
  newsItem?: NewsItem;
  onSubmit: (data: Partial<NewsItem>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function NewsForm({ newsItem, onSubmit, onCancel, isSubmitting = false }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    status: 'draft' as 'draft' | 'published',
    category: 'general',
  });

  const { uploadImage, isUploading } = useNewsImageUpload();

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || '',
        description: newsItem.description || '',
        content: newsItem.content || '',
        image_url: newsItem.image_url || '',
        status: newsItem.status || 'draft',
        category: newsItem.category || 'general',
      });
    }
  }, [newsItem]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        handleInputChange('image_url', imageUrl);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newsItem) {
      onSubmit({ ...formData, id: newsItem.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {newsItem ? 'Edit News Item' : 'Create News Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter news title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description (shown in card preview)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Full content (shown when expanded)"
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <div className="space-y-2">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              {formData.image_url && (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full max-w-sm rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleInputChange('image_url', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !formData.title.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : (newsItem ? 'Update' : 'Create')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
