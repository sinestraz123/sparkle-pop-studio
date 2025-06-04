
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/hooks/useNews';

export const useNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { newsItems, createNews, updateNews, isCreating, isUpdating } = useNews();
  const [isLoading, setIsLoading] = useState(false);

  const newsItem = id ? newsItems.find(item => item.id === id) : undefined;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleSave = async (formData: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (id) {
        // Update existing news item
        await updateNews({ ...formData, id });
        toast({
          title: "Success",
          description: "News item updated successfully",
        });
      } else {
        // Create new news item
        await createNews(formData);
        toast({
          title: "Success",
          description: "News item created successfully",
        });
        navigate('/news');
      }
    } catch (error) {
      console.error('Error saving news item:', error);
      toast({
        title: "Error",
        description: "Failed to save news item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/news');
  };

  return {
    newsItem,
    isLoading: isLoading || isCreating || isUpdating,
    handleSave,
    handleBack,
  };
};
