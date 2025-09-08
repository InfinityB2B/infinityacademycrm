import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Formato de e-mail inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  company: z.string().optional(),
  value: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  status: z.enum([
    LEAD_STATUSES.NEW,
    LEAD_STATUSES.CONTACTED,
    LEAD_STATUSES.QUALIFIED,
    LEAD_STATUSES.PROPOSAL,
    LEAD_STATUSES.NEGOTIATION,
    LEAD_STATUSES.WON,
    LEAD_STATUSES.LOST,
  ]),
  assignedTo: z.string().min(1, "Responsável é obrigatório"),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  onSubmit?: (data: LeadFormData) => void;
  initialData?: Partial<LeadFormData>;
  isEdit?: boolean;
}

export function LeadForm({ onSubmit, initialData, isEdit = false }: LeadFormProps) {
  const { toast } = useToast();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      value: initialData?.value || 0,
      status: initialData?.status || LEAD_STATUSES.NEW,
      assignedTo: initialData?.assignedTo || "",
    },
  });

  const handleSubmit = (data: LeadFormData) => {
    try {
      onSubmit?.(data);
      toast({
        title: isEdit ? "Lead atualizado" : "Lead criado",
        description: `Lead ${data.name} foi ${isEdit ? "atualizado" : "criado"} com sucesso.`,
      });
      
      if (!isEdit) {
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="exemplo@empresa.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(11) 99999-9999" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da empresa" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Estimado *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={LEAD_STATUSES.NEW}>Novo</SelectItem>
                    <SelectItem value={LEAD_STATUSES.CONTACTED}>Contatado</SelectItem>
                    <SelectItem value={LEAD_STATUSES.QUALIFIED}>Qualificado</SelectItem>
                    <SelectItem value={LEAD_STATUSES.PROPOSAL}>Proposta</SelectItem>
                    <SelectItem value={LEAD_STATUSES.NEGOTIATION}>Negociação</SelectItem>
                    <SelectItem value={LEAD_STATUSES.WON}>Ganho</SelectItem>
                    <SelectItem value={LEAD_STATUSES.LOST}>Perdido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Responsável *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do responsável" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Limpar
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? "Salvando..." 
              : isEdit 
                ? "Atualizar Lead" 
                : "Criar Lead"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}