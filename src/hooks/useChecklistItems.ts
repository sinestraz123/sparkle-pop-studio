
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type ChecklistItemInsert = TablesInsert<'checklist_items'>;

export const useChecklistItems = () => {
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
    } catch (err) {
      console.error('Error updating checklist items:', err);
      throw new Error('Failed to update checklist items');
    }
  };

  return {
    updateChecklistItems,
  };
};

// Export standalone function for backward compatibility
export const updateChecklistItems = async (checklistId: string, items: ChecklistItemInsert[]) => {
  try {
    await supabase
      .from('checklist_items')
      .delete()
      .eq('checklist_id', checklistId);

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
