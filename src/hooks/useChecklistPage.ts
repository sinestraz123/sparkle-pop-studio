
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';

type ChecklistItem = Tables<'checklist_items'>;
type Checklist = Tables<'checklists'>;

export interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

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

// Export for backward compatibility
export const useChecklistPage = useChecklist;
