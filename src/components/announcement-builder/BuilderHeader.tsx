
import React from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface BuilderHeaderProps {
  formData: any;
  previewMode: boolean;
  isLoading: boolean;
  onBack: () => void;
  onPreviewToggle: (mode: boolean) => void;
  onSave: () => void;
  onStatusChange: (status: string) => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  formData,
  previewMode,
  isLoading,
  onBack,
  onPreviewToggle,
  onSave,
  onStatusChange,
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => onStatusChange(checked ? 'active' : 'draft')}
          />
          <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
            {formData.status === 'active' ? 'Active' : 'Draft'}
          </Badge>
        </div>
      </div>
      
      <h1 className="text-xl font-semibold mb-4">Edit nudge</h1>
      
      <div className="flex gap-2">
        <Button 
          variant={previewMode ? "outline" : "default"} 
          size="sm"
          onClick={() => onPreviewToggle(false)}
        >
          Edit
        </Button>
        <Button 
          variant={previewMode ? "default" : "outline"} 
          size="sm"
          onClick={() => onPreviewToggle(true)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button 
          onClick={onSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
