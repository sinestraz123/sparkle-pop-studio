import React, { useState } from 'react';
import { Plus, Eye, MousePointer, Calendar, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { AnnouncementBuilder } from '@/components/AnnouncementBuilder';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Announcement = Tables<'announcements'>;

const Builder = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  const {
    announcements,
    isLoading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAnnouncements();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'modal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'banner':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'popover':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateAnnouncement = (data: any) => {
    return new Promise((resolve, reject) => {
      createAnnouncement(data, {
        onSuccess: (newAnnouncement) => {
          toast({
            title: "Success",
            description: "Announcement created successfully",
          });
          setShowBuilder(false);
          resolve(newAnnouncement);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create announcement",
            variant: "destructive",
          });
          console.error('Error creating announcement:', error);
          reject(error);
        },
      });
    });
  };

  const handleUpdateAnnouncement = (data: any) => {
    if (!editingAnnouncement) return Promise.reject('No announcement to update');
    
    return new Promise((resolve, reject) => {
      updateAnnouncement({ id: editingAnnouncement.id, ...data }, {
        onSuccess: (updatedAnnouncement) => {
          toast({
            title: "Success",
            description: "Announcement updated successfully",
          });
          setEditingAnnouncement(null);
          setShowBuilder(false);
          resolve(updatedAnnouncement);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update announcement",
            variant: "destructive",
          });
          console.error('Error updating announcement:', error);
          reject(error);
        },
      });
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Announcement deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete announcement",
            variant: "destructive",
          });
          console.error('Error deleting announcement:', error);
        },
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowBuilder(true);
  };

  const handleBack = () => {
    setShowBuilder(false);
    setEditingAnnouncement(null);
  };

  if (showBuilder) {
    return (
      <AnnouncementBuilder
        announcement={editingAnnouncement}
        onSave={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
        onBack={handleBack}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage your announcement campaigns</p>
        </div>
        <Button 
          onClick={() => setShowBuilder(true)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{announcements.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <MousePointer className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Grid */}
      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {announcement.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600"
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Type Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getStatusColor(announcement.status)}>
                    {announcement.status}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(announcement.type)}>
                    {announcement.type}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{(announcement.views || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="font-semibold">{announcement.clicks || 0}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span>Position: {announcement.position}</span>
                    <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(announcement)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first announcement to engage with your users
            </p>
            <Button 
              onClick={() => setShowBuilder(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Builder;
