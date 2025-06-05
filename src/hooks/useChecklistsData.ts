
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Checklist = Tables<'checklists'>;
type ChecklistItem = Tables<'checklist_items'>;
type ChecklistInsert = TablesInsert<'checklists'>;
type ChecklistUpdate = TablesUpdate<'checklists'>;

export interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

export const useChecklistsData = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchChecklists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChecklists(data || []);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError('Failed to load checklists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [user]);

  return {
    checklists,
    loading,
    error,
    refetch: fetchChecklists,
  };
};
