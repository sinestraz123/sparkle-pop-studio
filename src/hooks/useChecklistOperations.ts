
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ChecklistInsert = TablesInsert<'checklists'>;
type ChecklistUpdate = TablesUpdate<'checklists'>;

export const useChecklistOperations = (onSuccess?: () => void) => {
  const { user } = useAuth();

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
      if (onSuccess) onSuccess();
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
      if (onSuccess) onSuccess();
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
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error deleting checklist:', err);
      throw new Error('Failed to delete checklist');
    }
  };

  return {
    createChecklist,
    updateChecklist,
    deleteChecklist,
  };
};
