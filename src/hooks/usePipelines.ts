import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Contact {
  contactid: string;
  firstname: string;
  lastname: string;
  company?: string;
}

export interface Deal {
  dealid: string;
  dealtitle: string;
  dealvalue?: number;
  status: string;
  stageid: string;
  pipelineid: string;
  contacts?: Contact;
}

export interface Stage {
  stageid: string;
  stagename: string;
  stageorder: number;
  pipelineid: string;
  deals: Deal[];
}

export interface Pipeline {
  pipelineid: string;
  pipelinename: string;
  pipelinetype: string;
  stages: Stage[];
}

export const usePipelines = () => {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: async (): Promise<Pipeline[]> => {
      try {
        // Fetch all pipelines
        const { data: pipelinesData, error: pipelinesError } = await supabase
          .from('pipelines')
          .select('*')
          .order('createdat');

        if (pipelinesError) throw pipelinesError;

        if (!pipelinesData || pipelinesData.length === 0) {
          return [];
        }

        // Fetch stages for all pipelines
        const { data: stagesData, error: stagesError } = await supabase
          .from('stages')
          .select('*')
          .order('stageorder');

        if (stagesError) throw stagesError;

        // Fetch deals with contact information
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select(`
            dealid,
            dealtitle,
            dealvalue,
            status,
            stageid,
            pipelineid,
            contacts:contactid (
              contactid,
              firstname,
              lastname,
              company
            )
          `)
          .eq('status', 'OPEN');

        if (dealsError) throw dealsError;

        // Organize data into hierarchical structure
        const pipelinesWithStages = pipelinesData.map(pipeline => {
          const pipelineStages = stagesData
            ?.filter(stage => stage.pipelineid === pipeline.pipelineid)
            ?.map(stage => ({
              ...stage,
              deals: dealsData?.filter(deal => deal.stageid === stage.stageid) || []
            })) || [];

          return {
            ...pipeline,
            stages: pipelineStages
          };
        });

        return pipelinesWithStages;
      } catch (error) {
        console.error('Error fetching pipelines data:', error);
        throw error;
      }
    },
  });
};

export const useUpdateDealStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, newStageId }: { dealId: string; newStageId: string }) => {
      const { error } = await supabase
        .from('deals')
        .update({ stageid: newStageId })
        .eq('dealid', dealId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast.success('Deal movido com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating deal stage:', error);
      toast.error('Erro ao mover deal');
    },
  });
};