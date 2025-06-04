
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChecklistBuilder } from '@/components/ChecklistBuilder';
import { useChecklist, useChecklists } from '@/hooks/useChecklists';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Checklist = () => {
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
      if (checklistId && checklist) {
        const { updateChecklistItems } = require('@/hooks/useChecklists');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checklist...</p>
        </div>
      </div>
    );
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
