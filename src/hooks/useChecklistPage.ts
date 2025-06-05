import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type ChecklistItem = Tables<'checklist_items'>;
type Checklist = Tables<'checklists'>;

export interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

interface ChecklistFormData {
  title: string;
  description: string;
  show_progress: boolean;
  progress_bar_color: string;
  button_text: string;
  button_url: string;
  auto_hide: boolean;
  status: string;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    media_type: 'none' | 'image' | 'gif' | 'url';
    media_url?: string;
  }>;
}

export const useChecklistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistWithItems | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchChecklist = async () => {
    if (!id || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklists')
        .select(`
          *,
          checklist_items (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      const sortedData = {
        ...data,
        checklist_items: data.checklist_items?.sort((a, b) => a.order_index - b.order_index) || []
      };
      
      setChecklist(sortedData);
    } catch (err) {
      console.error('Error fetching checklist:', err);
      setError('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: ChecklistFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      if (id) {
        // Update existing checklist
        const { error: checklistError } = await supabase
          .from('checklists')
          .update({
            title: formData.title,
            description: formData.description,
            show_progress: formData.show_progress,
            progress_bar_color: formData.progress_bar_color,
            button_text: formData.button_text,
            button_url: formData.button_url,
            auto_hide: formData.auto_hide,
            status: formData.status,
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (checklistError) throw checklistError;

        // Update checklist items
        // First, delete all existing items
        await supabase
          .from('checklist_items')
          .delete()
          .eq('checklist_id', id);

        // Then insert new items
        if (formData.items.length > 0) {
          const itemsToInsert = formData.items.map((item, index) => ({
            checklist_id: id,
            title: item.title,
            description: item.description,
            media_type: item.media_type,
            media_url: item.media_url,
            order_index: index,
          }));

          const { error: itemsError } = await supabase
            .from('checklist_items')
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }
      } else {
        // Create new checklist
        const { data: newChecklist, error: checklistError } = await supabase
          .from('checklists')
          .insert({
            title: formData.title,
            description: formData.description,
            show_progress: formData.show_progress,
            progress_bar_color: formData.progress_bar_color,
            button_text: formData.button_text,
            button_url: formData.button_url,
            auto_hide: formData.auto_hide,
            status: formData.status,
            user_id: user.id,
          })
          .select()
          .single();

        if (checklistError) throw checklistError;

        // Insert checklist items
        if (formData.items.length > 0) {
          const itemsToInsert = formData.items.map((item, index) => ({
            checklist_id: newChecklist.id,
            title: item.title,
            description: item.description,
            media_type: item.media_type,
            media_url: item.media_url,
            order_index: index,
          }));

          const { error: itemsError } = await supabase
            .from('checklist_items')
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }

        navigate(`/checklist/${newChecklist.id}`);
      }

      toast.success('Checklist saved successfully!');
      await fetchChecklist();
    } catch (err) {
      console.error('Error saving checklist:', err);
      toast.error('Failed to save checklist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchChecklist();
  }, [id, user]);

  return {
    checklist,
    loading,
    isLoading,
    error,
    handleSave,
    handleBack,
    refetch: fetchChecklist,
  };
};

// Keep backward compatibility
export const useChecklist = (id?: string) => {
  const [checklist, setChecklist] = useState<ChecklistWithItems | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchChecklist = async () => {
    if (!id || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklists')
        .select(`
          *,
          checklist_items (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      const sortedData = {
        ...data,
        checklist_items: data.checklist_items?.sort((a, b) => a.order_index - b.order_index) || []
      };
      
      setChecklist(sortedData);
    } catch (err) {
      console.error('Error fetching checklist:', err);
      setError('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id, user]);

  return {
    checklist,
    loading,
    error,
    refetch: fetchChecklist,
  };
};
