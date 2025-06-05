
import { useChecklistsData } from './useChecklistsData';
import { useChecklistOperations } from './useChecklistOperations';

export const useChecklists = () => {
  const { checklists, loading, error, refetch } = useChecklistsData();
  const { createChecklist, updateChecklist, deleteChecklist } = useChecklistOperations(refetch);

  return {
    checklists,
    loading,
    error,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    refetch,
  };
};

// Re-export other hooks and utilities
export { useChecklist } from './useChecklistPage';
export { updateChecklistItems } from './useChecklistItems';
export type { ChecklistWithItems } from './useChecklistsData';
