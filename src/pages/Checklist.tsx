
import React from 'react';
import { ChecklistBuilder } from '@/components/ChecklistBuilder';
import { ChecklistLoadingSpinner } from '@/components/checklist/ChecklistLoadingSpinner';
import { useChecklistPage } from '@/hooks/useChecklistPage';

const Checklist = () => {
  const { checklist, loading, isLoading, handleSave, handleBack } = useChecklistPage();

  if (loading) {
    return <ChecklistLoadingSpinner />;
  }

  return (
    <ChecklistBuilder
      checklist={checklist || undefined}
      onSave={handleSave}
      onBack={handleBack}
      isLoading={isLoading}
    />
  );
};

export default Checklist;
