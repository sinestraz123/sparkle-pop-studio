
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Banner } from '@/types/banner';
import { useToast } from '@/hooks/use-toast';

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBanners = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (banner: Partial<Banner>) => {
    if (!user) return null;

    try {
      const bannerData = {
        ...banner,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (banner.id) {
        // Update existing banner
        const { data, error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', banner.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setBanners(prev => prev.map(b => b.id === banner.id ? data : b));
        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
        return data;
      } else {
        // Create new banner
        const { data, error } = await supabase
          .from('banners')
          .insert([bannerData])
          .select()
          .single();

        if (error) throw error;
        
        setBanners(prev => [data, ...prev]);
        toast({
          title: "Success",
          description: "Banner created successfully",
        });
        return data;
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteBanner = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setBanners(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [user]);

  return {
    banners,
    loading,
    saveBanner,
    deleteBanner,
    refetch: fetchBanners,
  };
};
