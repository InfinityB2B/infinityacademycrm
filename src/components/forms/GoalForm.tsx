import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSalesTeam } from "@/hooks/useSalesTeam";

const goalSchema = z.object({
  targetuser: z.string().optional(),
  targetteam: z.string().optional(),
  metric: z.enum(['REVENUE', 'DEALS_WON', 'APPOINTMENTS_SCHEDULED']),
  targetvalue: z.coerce.number().min(0, "Valor deve ser positivo"),
  startdate: z.date({ required_error: "Data de início é obrigatória" }),
  enddate: z.date({ required_error: "Data de fim é obrigatória" }),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  onSubmit: (data: any) => void;
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const { data: salesTeam } = useSalesTeam();
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      metric: 'REVENUE',
      targetvalue: 0,
    },
  });

  const handleSubmit = (data: GoalFormValues) => {
    const formattedData = {
      ...data,
      startdate: format(data.startdate, 'yyyy-MM-dd'),
      enddate: format(data.enddate, 'yyyy-MM-dd'),
    };
    onSubmit(formattedData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="metric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Métrica</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a métrica" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REVENUE">Receita</SelectItem>
                  <SelectItem value="DEALS_WON">Deals Ganhos</SelectItem>
                  <SelectItem value="APPOINTMENTS_SCHEDULED">Agendamentos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetvalue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Alvo</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetuser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário Responsável (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salesTeam?.map((user) => (
                    <SelectItem key={user.userid} value={user.userid}>
                      {user.firstname} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetteam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team ID (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="team-id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Início</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enddate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Fim</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit">Criar Meta</Button>
        </div>
      </form>
    </Form>
  );
}
