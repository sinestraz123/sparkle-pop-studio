
import React from 'react';
import { ArrowLeft, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SpotlightBuilderHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  isLoading: boolean;
  status: string;
  onStatusChange: (status: string) => void;
  previewMode: boolean;
  onPreviewToggle: (preview: boolean) => void;
}

export const SpotlightBuilderHeader: React.FC<SpotlightBuilderHeaderProps> = ({
  title,
  onBack,
  onSave,
  isLoading,
  status,
  onStatusChange,
  previewMode,
  onPreviewToggle,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {title || 'New Spotlight'}
          </h1>
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreviewToggle(!previewMode)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {previewMode ? 'Edit' : 'Preview'}
        </Button>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
