
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

      setVideoTutorials(data || []);
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
