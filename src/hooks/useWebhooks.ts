import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Webhook {
  webhookid: string;
  webhookname: string;
  targeturl: string;
  event: string;
  linkedpipelineid?: string;
  isactive: boolean;
  createdat: string;
}

export const useWebhooks = () => {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) throw error;
      return data as Webhook[];
    },
  });
};

export const useAddWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webhook: { 
      webhookname: string; 
      event: string; 
      linkedpipelineid?: string;
    }) => {
      // Generate the webhook URL based on the Supabase project
      const projectId = 'spnbyczjlhvfptvukthy';
      const targeturl = `https://${projectId}.supabase.co/functions/v1/incoming-lead-webhook`;

      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          ...webhook,
          targeturl,
          isactive: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating webhook:', error);
      toast.error('Erro ao criar webhook');
    },
  });
};

export const useUpdateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ webhookid, ...updates }: Partial<Webhook> & { webhookid: string }) => {
      const { error } = await supabase
        .from('webhooks')
        .update(updates)
        .eq('webhookid', webhookid);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating webhook:', error);
      toast.error('Erro ao atualizar webhook');
    },
  });
};

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webhookid: string) => {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('webhookid', webhookid);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting webhook:', error);
      toast.error('Erro ao excluir webhook');
    },
  });
};
