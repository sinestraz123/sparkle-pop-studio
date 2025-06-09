
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Banner } from '@/components/BannerBuilder';
import { useNavigate } from 'react-router-dom';

interface BannerBuilderHeaderProps {
  banner: Banner;
  onBannerChange: (updates: Partial<Banner>) => void;
}

export const BannerBuilderHeader = ({ banner, onBannerChange }: BannerBuilderHeaderProps) => {
  const navigate = useNavigate();

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving banner:', banner);
  };

  return (
    <div className="p-6 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Banner
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{banner.title}</h1>
          <p className="text-gray-600">Design and customize your banner</p>
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
