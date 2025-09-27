import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Deal {
  dealid: string;
  dealtitle: string;
  dealvalue: number;
  status: 'OPEN' | 'WON' | 'LOST';
  contactid?: string;
  ownerid?: string;
  stageid: string;
  pipelineid: string;
  wonat?: string;
  lostat?: string;
  lostreason?: string;
  createdat: string;
}

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async (): Promise<Deal[]> => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealData: Omit<Deal, 'dealid' | 'createdat'>) => {
      const { error } = await supabase
        .from('deals')
        .insert([dealData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Deal criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error adding deal:', error);
      toast.error('Erro ao criar deal');
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealid, updates }: { dealid: string; updates: Partial<Deal> }) => {
      const { error } = await supabase
        .from('deals')
        .update(updates)
        .eq('dealid', dealid);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Deal atualizado!');
    },
    onError: (error) => {
      console.error('Error updating deal:', error);
      toast.error('Erro ao atualizar deal');
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealid: string) => {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('dealid', dealid);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Deal removido!');
    },
    onError: (error) => {
      console.error('Error deleting deal:', error);
      toast.error('Erro ao remover deal');
    },
  });
};