
import { useState } from 'react';
import { Plus, Edit, Trash2, Code, Eye, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBanners } from '@/hooks/useBanners';
import { Banner } from '@/types/banner';
import { ScriptModal } from '@/components/ScriptModal';

interface BannersListProps {
  onEditBanner: (banner: Banner) => void;
  onCreateNew: () => void;
}

export const BannersList = ({ onEditBanner, onCreateNew }: BannersListProps) => {
  const { banners, loading, deleteBanner } = useBanners();
  const [scriptModal, setScriptModal] = useState<{ isOpen: boolean; banner: Banner | null }>({
    isOpen: false,
    banner: null,
  });

  const handleShowScript = (banner: Banner) => {
    setScriptModal({ isOpen: true, banner });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await deleteBanner(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Banners</h1>
          <p className="text-gray-600">Create and manage your banner campaigns</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners yet</h3>
              <p className="text-gray-600 mb-4">Create your first banner to get started</p>
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Banner
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">{banner.title}</CardTitle>
                  <Badge variant={banner.status === 'active' ? 'default' : 'secondary'}>
                    {banner.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 line-clamp-2">
                  {banner.content || 'No description'}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {banner.views || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MousePointer className="h-3 w-3" />
                    {banner.clicks || 0}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBanner(banner)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowScript(banner)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ScriptModal
        isOpen={scriptModal.isOpen}
        onClose={() => setScriptModal({ isOpen: false, banner: null })}
        announcement={scriptModal.banner}
      />
    </div>
  );
};
