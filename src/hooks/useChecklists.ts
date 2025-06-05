
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Checklist = Tables<'checklists'>;
type ChecklistInsert = TablesInsert<'checklists'>;
type ChecklistUpdate = TablesUpdate<'checklists'>;
type ChecklistItem = Tables<'checklist_items'>;
type ChecklistItemInsert = TablesInsert<'checklist_items'>;

export interface ChecklistWithItems extends Checklist {
  checklist_items: ChecklistItem[];
}

export const useChecklists = () => {
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

  const createChecklist = async (checklistData: Omit<ChecklistInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('checklists')
        .insert({
          ...checklistData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchChecklists();
      return data;
    } catch (err) {
      console.error('Error creating checklist:', err);
      throw new Error('Failed to create checklist');
    }
  };

  const updateChecklist = async (id: string, updates: ChecklistUpdate) => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchChecklists();
      return data;
    } catch (err) {
      console.error('Error updating checklist:', err);
      throw new Error('Failed to update checklist');
    }
  };

  const deleteChecklist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('checklists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchChecklists();
    } catch (err) {
      console.error('Error deleting checklist:', err);
      throw new Error('Failed to delete checklist');
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [user]);

  return {
    checklists,
    loading,
    error,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    refetch: fetchChecklists,
  };
};

export const useChecklist = (id?: string) => {
  const [checklist, setChecklist] = useState<ChecklistWithItems | null>(null);
  const [loading, setLoading] = useState(!!id); // Only loading if we have an ID
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
      
      // Sort items by order_index
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

  const updateChecklistItems = async (checklistId: string, items: ChecklistItemInsert[]) => {
    try {
      // Delete existing items
      await supabase
        .from('checklist_items')
        .delete()
        .eq('checklist_id', checklistId);

      // Insert new items
      if (items.length > 0) {
        const { error } = await supabase
          .from('checklist_items')
          .insert(items.map((item, index) => ({
            ...item,
            checklist_id: checklistId,
            order_index: index,
          })));

        if (error) throw error;
      }

      await fetchChecklist();
    } catch (err) {
      console.error('Error updating checklist items:', err);
      throw new Error('Failed to update checklist items');
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id, user]);

  return {
    checklist,
    loading,
    error,
    updateChecklistItems,
    refetch: fetchChecklist,
  };
};

// Export the updateChecklistItems function for use in other files
export const updateChecklistItems = async (checklistId: string, items: ChecklistItemInsert[]) => {
  try {
    // Delete existing items
    await supabase
      .from('checklist_items')
      .delete()
      .eq('checklist_id', checklistId);

    // Insert new items
    if (items.length > 0) {
      const { error } = await supabase
        .from('checklist_items')
        .insert(items.map((item, index) => ({
          ...item,
          checklist_id: checklistId,
          order_index: index,
        })));

      if (error) throw error;
    }
  } catch (err) {
    console.error('Error updating checklist items:', err);
    throw new Error('Failed to update checklist items');
  }
};
