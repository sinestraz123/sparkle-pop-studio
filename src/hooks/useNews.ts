
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useNews = (newsId?: string) => {
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (newsId) {
      fetchNewsItem();
    }
  }, [newsId]);

  const fetchNewsItem = async () => {
    if (!newsId || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('id', newsId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setNewsItem(data);
    } catch (error) {
      console.error('Error fetching news item:', error);
      toast({
        title: "Error",
        description: "Failed to load news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: any) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .insert({
          ...newsData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "News item created successfully",
      });

      navigate(`/news/${data.id}`);
      return data;
    } catch (error) {
      console.error('Error creating news item:', error);
      toast({
        title: "Error",
        description: "Failed to create news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async (id: string, newsData: any) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news_items')
        .update(newsData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setNewsItem(data);
      toast({
        title: "Success",
        description: "News item updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating news item:', error);
      toast({
        title: "Error",
        description: "Failed to update news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('news_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News item deleted successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting news item:', error);
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    newsItem,
    loading,
    createNews,
    updateNews,
    deleteNews,
  };
};
