
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useChecklist, useChecklists } from '@/hooks/useChecklists';

export const useChecklistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { checklist, loading } = useChecklist(id);
  const { createChecklist, updateChecklist } = useChecklists();
  const [isLoading, setIsLoading] = useState(false);

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
      const checklistData = {
        title: formData.title,
        description: formData.description,
        show_progress: formData.show_progress,
        progress_bar_color: formData.progress_bar_color,
        button_text: formData.button_text,
        button_url: formData.button_url,
        auto_hide: formData.auto_hide,
        status: formData.status,
      };

      let checklistId = id;

      if (id) {
        // Update existing checklist
        await updateChecklist(id, checklistData);
        toast({
          title: "Success",
          description: "Checklist updated successfully",
        });
      } else {
        // Create new checklist
        const newChecklist = await createChecklist(checklistData);
        checklistId = newChecklist.id;
        toast({
          title: "Success",
          description: "Checklist created successfully",
        });
        navigate(`/checklist/${newChecklist.id}`);
      }

      // Update checklist items if we have a checklist ID
      if (checklistId && formData.items) {
        const { updateChecklistItems } = await import('@/hooks/useChecklists');
        await updateChecklistItems(checklistId, formData.items.map((item: any) => ({
          title: item.title,
          description: item.description,
          media_type: item.media_type,
          media_url: item.media_url,
        })));
      }

    } catch (error) {
      console.error('Error saving checklist:', error);
      toast({
        title: "Error",
        description: "Failed to save checklist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return {
    checklist,
    loading,
    isLoading,
    handleSave,
    handleBack,
  };
};
