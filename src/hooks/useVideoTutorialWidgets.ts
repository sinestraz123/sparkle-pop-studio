
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { VideoTutorialsConfig } from '@/components/VideoTutorialsBuilder';

export const useVideoTutorialWidgets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: widgets = [], isLoading, error } = useQuery({
    queryKey: ['video-tutorial-widgets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // For now, return mock data since we haven't created the database table yet
      return [
        {
          id: '1',
          title: 'Getting Started Tutorials',
          description: 'Learn the basics of our platform',
          tutorials: [
            {
              id: '1',
              title: 'Welcome to Glyph AI',
              description: 'An introduction to our platform and its features',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              duration: '3:45'
            }
          ],
          backgroundColor: '#ffffff',
          textColor: '#000000',
          buttonColor: '#3b82f6',
          position: 'bottom-right' as const,
          showCloseButton: true,
          triggerButtonText: 'Watch Tutorials',
          isActive: false,
        }
      ] as VideoTutorialsConfig[];
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<VideoTutorialsConfig>) => {
      // Mock update - in real implementation this would update the database
      console.log('Updating widget:', id, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-tutorial-widgets'] });
      toast({
        title: "Success",
        description: "Video tutorial widget updated successfully",
      });
    },
  });

  const createWidget = (): Omit<VideoTutorialsConfig, 'id'> => {
    return {
      title: 'New Video Tutorial Widget',
      description: 'Help users learn with video tutorials',
      tutorials: [
        {
          id: '1',
          title: 'Getting Started',
          description: 'Learn the basics',
          videoUrl: '',
          duration: '5:00'
        }
      ],
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#3b82f6',
      position: 'bottom-right',
      showCloseButton: true,
      triggerButtonText: 'Watch Tutorials',
      isActive: false,
    };
  };

  const addWidget = () => {
    const newWidget = createWidget();
    // Mock creation - in real implementation this would create in database
    console.log('Creating new widget:', newWidget);
    toast({
      title: "Success",
      description: "Video tutorial widget created successfully",
    });
  };

  const updateWidget = (widgetId: string, updates: Partial<VideoTutorialsConfig>) => {
    updateMutation.mutate({ id: widgetId, ...updates });
  };

  const deleteWidget = (widgetId: string) => {
    // Mock deletion - in real implementation this would delete from database
    console.log('Deleting widget:', widgetId);
    toast({
      title: "Success",
      description: "Video tutorial widget deleted successfully",
    });
  };

  return {
    widgets,
    isLoading: false, // Set to false since we're using mock data
    error,
    addWidget,
    updateWidget,
    deleteWidget,
    isUpdating: updateMutation.isPending,
  };
};
