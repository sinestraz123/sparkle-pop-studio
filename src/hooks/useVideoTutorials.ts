
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface VideoTutorial {
  id: string;
  title: string;
  tutorials: Array<{
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail?: string;
  }>;
  settings: {
    showCloseButton: boolean;
    autoPlay: boolean;
    overlay: boolean;
  };
  status: 'draft' | 'active';
  views: number;
}

export const useVideoTutorials = () => {
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadVideoTutorials = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_tutorials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData: VideoTutorial[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        tutorials: Array.isArray(item.tutorials) ? item.tutorials.map((tutorial: any) => ({
          id: tutorial.id || crypto.randomUUID(),
          title: tutorial.title || '',
          description: tutorial.description || '',
          videoUrl: tutorial.videoUrl || '',
          thumbnail: tutorial.thumbnail
        })) : [],
        settings: typeof item.settings === 'object' && item.settings ? {
          showCloseButton: Boolean(item.settings.showCloseButton ?? true),
          autoPlay: Boolean(item.settings.autoPlay ?? false),
          overlay: Boolean(item.settings.overlay ?? true)
        } : {
          showCloseButton: true,
          autoPlay: false,
          overlay: true
        },
        status: (item.status as 'draft' | 'active') || 'draft',
        views: item.views || 0
      }));

      setVideoTutorials(transformedData);
    } catch (error) {
      console.error('Error loading video tutorials:', error);
      toast({
        title: "Error",
        description: "Failed to load video tutorials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideoTutorial = async (videoTutorial: VideoTutorial) => {
    if (!user) return null;

    try {
      const tutorialData = {
        title: videoTutorial.title,
        tutorials: videoTutorial.tutorials,
        settings: videoTutorial.settings,
        status: videoTutorial.status,
        user_id: user.id
      };

      if (videoTutorial.id === 'new') {
        const { data, error } = await supabase
          .from('video_tutorials')
          .insert(tutorialData)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video tutorial created successfully",
        });

        await loadVideoTutorials();
        return data;
      } else {
        const { data, error } = await supabase
          .from('video_tutorials')
          .update(tutorialData)
          .eq('id', videoTutorial.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video tutorial updated successfully",
        });

        await loadVideoTutorials();
        return data;
      }
    } catch (error) {
      console.error('Error saving video tutorial:', error);
      toast({
        title: "Error",
        description: "Failed to save video tutorial",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteVideoTutorial = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('video_tutorials')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video tutorial deleted successfully",
      });

      await loadVideoTutorials();
    } catch (error) {
      console.error('Error deleting video tutorial:', error);
      toast({
        title: "Error",
        description: "Failed to delete video tutorial",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadVideoTutorials();
  }, [user]);

  return {
    videoTutorials,
    isLoading,
    saveVideoTutorial,
    deleteVideoTutorial,
    loadVideoTutorials
  };
};
