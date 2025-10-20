import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePipelines } from '@/hooks/usePipelines';

const webhookFormSchema = z.object({
  webhookname: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  event: z.string().min(1, 'Selecione um evento'),
  linkedpipelineid: z.string().optional(),
});

type WebhookFormValues = z.infer<typeof webhookFormSchema>;

interface WebhookFormProps {
  onSubmit: (data: WebhookFormValues) => void;
}

export const WebhookForm = ({ onSubmit }: WebhookFormProps) => {
  const { data: pipelines, isLoading: isLoadingPipelines } = usePipelines();

  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      webhookname: '',
      event: '',
      linkedpipelineid: '',
    },
  });

  const handleSubmit = (data: WebhookFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="webhookname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Webhook</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Integração Facebook Ads" 
                  {...field} 
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o tipo de evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new_lead">Novo Lead</SelectItem>
                  <SelectItem value="deal_won">Deal Ganho</SelectItem>
                  <SelectItem value="deal_lost">Deal Perdido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedpipelineid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pipeline Vinculado (Opcional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoadingPipelines}
              >
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione um pipeline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {pipelines?.map((pipeline) => (
                    <SelectItem key={pipeline.pipelineid} value={pipeline.pipelineid}>
                      {pipeline.pipelinename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
        >
          Criar Webhook
        </Button>
      </form>
    </Form>
  );
};
