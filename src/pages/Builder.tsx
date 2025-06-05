
import React, { useState } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { AnnouncementBuilder } from '@/components/AnnouncementBuilder';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { StatsOverview } from '@/components/builder/StatsOverview';
import { AnnouncementCard } from '@/components/builder/AnnouncementCard';
import { EmptyState } from '@/components/builder/EmptyState';
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

  const handleCreateClick = () => setShowBuilder(true);

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
      <BuilderHeader onCreateAnnouncement={handleCreateClick} />
      <StatsOverview announcements={announcements} />
      
      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={handleEdit}
              onDelete={handleDeleteAnnouncement}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreateAnnouncement={handleCreateClick} />
      )}
    </div>
  );
};

export default Builder;
