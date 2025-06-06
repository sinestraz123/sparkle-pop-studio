
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Survey } from '@/types/survey';

export const useSingleSurvey = (id?: string) => {
  const { data: survey, isLoading } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Survey;
    },
    enabled: !!id,
  });

  return { survey, loading: isLoading };
};
