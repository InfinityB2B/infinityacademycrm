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

const salesPersonSchema = z.object({
  firstname: z.string().min(1, "Nome é obrigatório"),
  lastname: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  passwordhash: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  profilepictureurl: z.string().optional(),
  roleid: z.string().optional(),
  teamid: z.string().optional(),
});

type SalesPersonFormValues = z.infer<typeof salesPersonSchema>;

interface SalesPersonFormProps {
  onSubmit: (data: SalesPersonFormValues) => void;
}

export function SalesPersonForm({ onSubmit }: SalesPersonFormProps) {
  const form = useForm<SalesPersonFormValues>({
    resolver: zodResolver(salesPersonSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      passwordhash: "",
      profilepictureurl: "",
      roleid: "",
      teamid: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="João" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input placeholder="Silva" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordhash"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profilepictureurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Foto (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roleid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role ID (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="role-id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamid"
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
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit">Adicionar Vendedor</Button>
        </div>
      </form>
    </Form>
  );
}
