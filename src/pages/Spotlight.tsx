
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Eye, Code, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpotlights, useSpotlight } from '@/hooks/useSpotlights';
import { SpotlightBuilder } from '@/components/SpotlightBuilder';
import { useToast } from '@/hooks/use-toast';

const Spotlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { spotlights, createSpotlight, updateSpotlight, deleteSpotlight, isLoading } = useSpotlights();
  const { data: currentSpotlight } = useSpotlight(id);
  const [showBuilder, setShowBuilder] = useState(!!id);

  const handleCreateNew = () => {
    setShowBuilder(true);
    navigate('/spotlight/new');
  };

  const handleEdit = (spotlightId: string) => {
    navigate(`/spotlight/${spotlightId}`);
    setShowBuilder(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (id && id !== 'new') {
        const result = await new Promise((resolve, reject) => {
          updateSpotlight({ id, ...data }, {
            onSuccess: resolve,
            onError: reject,
          });
        });
        return result;
      } else {
        const result = await new Promise((resolve, reject) => {
          createSpotlight(data, {
            onSuccess: (createdSpotlight) => {
              navigate(`/spotlight/${createdSpotlight.id}`);
              resolve(createdSpotlight);
            },
            onError: reject,
          });
        });
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    setShowBuilder(false);
    navigate('/spotlight');
  };

  const handleDelete = async (spotlightId: string) => {
    if (window.confirm('Are you sure you want to delete this spotlight?')) {
      deleteSpotlight(spotlightId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showBuilder) {
    return (
      <SpotlightBuilder
        spotlight={currentSpotlight}
        onSave={handleSave}
        onBack={handleBack}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spotlight</h1>
          <p className="text-gray-600">Create engaging video showcases for your website</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Spotlight
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : spotlights.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Code className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No spotlights</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first video spotlight.
            </p>
            <div className="mt-6">
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Spotlight
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlights.map((spotlight) => (
            <Card key={spotlight.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{spotlight.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {spotlight.video_url ? 'Video configured' : 'No video URL'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(spotlight.status)}>
                    {spotlight.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Video preview placeholder */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{spotlight.views || 0} views</span>
                    <span>{spotlight.clicks || 0} clicks</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(spotlight.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(spotlight.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Spotlight;
