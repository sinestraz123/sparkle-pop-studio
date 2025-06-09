
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Banner } from '@/types/banner';

interface BannerBuilderHeaderProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const BannerBuilderHeader = ({ 
  banner, 
  onBannerChange, 
  onSave, 
  onCancel, 
  isEditing 
}: BannerBuilderHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Banners
          </Button>
        )}
        
        {onSave && (
          <Button onClick={onSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Banner' : 'Save Banner'}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Banner' : 'Create Banner'}
          </h1>
          <p className="text-gray-600">Design engaging banners for your website</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              banner.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {banner.status}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <Switch
              checked={banner.status === 'active'}
              onCheckedChange={(checked) => 
                onBannerChange({ status: checked ? 'active' : 'draft' })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
