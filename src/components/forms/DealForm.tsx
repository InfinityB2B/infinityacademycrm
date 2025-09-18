import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { DEAL_STATUSES } from "@/lib/constants";

const dealSchema = z.object({
  dealtitle: z.string().min(1, "Título é obrigatório"),
  dealvalue: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  status: z.enum([
    DEAL_STATUSES.OPEN,
    DEAL_STATUSES.WON,
    DEAL_STATUSES.LOST
  ]),
  contactid: z.string().optional(),
  ownerid: z.string().optional(),
  stageid: z.string().min(1, "Stage é obrigatório"),
  pipelineid: z.string().min(1, "Pipeline é obrigatório"),
  lostreason: z.string().optional()
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  onSubmit: (data: DealFormData) => void;
  initialData?: Partial<DealFormData>;
  isEdit?: boolean;
}

export function DealForm({ onSubmit, initialData, isEdit = false }: DealFormProps) {
  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      dealtitle: initialData?.dealtitle || "",
      dealvalue: initialData?.dealvalue || 0,
      status: initialData?.status || DEAL_STATUSES.OPEN,
      contactid: initialData?.contactid || "",
      ownerid: initialData?.ownerid || "",
      stageid: initialData?.stageid || "",
      pipelineid: initialData?.pipelineid || "",
      lostreason: initialData?.lostreason || ""
    }
  });

  const handleSubmit = async (data: DealFormData) => {
    try {
      onSubmit(data);
      toast.success(isEdit ? "Deal atualizado com sucesso!" : "Deal criado com sucesso!");
      
      if (!isEdit) {
        form.reset();
      }
    } catch (error) {
      toast.error("Erro ao salvar deal. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="dealtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Deal</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título do deal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dealvalue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Deal</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
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
                  <FormLabel>Status do Deal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DEAL_STATUSES).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stageid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o ID do stage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pipelineid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o ID do pipeline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contactid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact ID (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o ID do contato" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner ID (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o ID do responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lostreason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo da Perda (Opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite o motivo da perda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Limpar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEdit ? "Atualizar Deal" : "Criar Deal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}