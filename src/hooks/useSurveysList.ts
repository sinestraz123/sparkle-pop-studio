
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Survey, SurveyInsert } from '@/types/survey';

export const useSurveysList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Survey[];
    },
    enabled: !!user,
  });

  const createSurveyMutation = useMutation({
    mutationFn: async (surveyData: Partial<Survey>) => {
      if (!user) throw new Error('User not authenticated');

      const insertData: SurveyInsert = {
        user_id: user.id,
        title: surveyData.title || 'Untitled Survey',
        description: surveyData.description,
        status: surveyData.status || 'draft',
        background_color: surveyData.background_color || '#ffffff',
        text_color: surveyData.text_color || '#000000',
        button_color: surveyData.button_color || '#3b82f6',
        position: surveyData.position || 'center',
        type: surveyData.type || 'modal',
        trigger_type: surveyData.trigger_type || 'auto_show',
        auto_show: surveyData.auto_show || false,
        delay: surveyData.delay || 0,
        show_close_button: surveyData.show_close_button !== false,
        show_progress: surveyData.show_progress !== false,
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Success",
        description: "Survey created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: "Failed to create survey",
        variant: "destructive",
      });
    },
  });

  const updateSurveyMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Survey> & { id: string }) => {
      const { data, error } = await supabase
        .from('surveys')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
    onError: (error) => {
      console.error('Error updating survey:', error);
      toast({
        title: "Error",
        description: "Failed to update survey",
        variant: "destructive",
      });
    },
  });

  const deleteSurvey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Success",
        description: "Survey deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting survey:', error);
      toast({
        title: "Error",
        description: "Failed to delete survey",
        variant: "destructive",
      });
    },
  });

  return {
    surveys,
    isLoading,
    createSurvey: createSurveyMutation.mutateAsync,
    updateSurvey: updateSurveyMutation.mutateAsync,
    deleteSurvey: deleteSurvey.mutate,
  };
};
