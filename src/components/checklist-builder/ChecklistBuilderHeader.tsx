
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ChecklistBuilderHeaderProps {
  formData: any;
  isLoading: boolean;
  onBack: () => void;
  onSave: () => void;
  onStatusChange: (status: string) => void;
}

export const ChecklistBuilderHeader: React.FC<ChecklistBuilderHeaderProps> = ({
  formData,
  isLoading,
  onBack,
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
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Checklist</h1>
        
        <Button 
          onClick={onSave}
          disabled={isLoading}
          className="bg-black hover:bg-gray-800 text-white"
          size="sm"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
