import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExpenseCategory {
  categoryid: string;
  categoryname: string;
  iseditable: boolean;
}

export interface Expense {
  expenseid: string;
  description: string;
  amount: number;
  categoryid: string;
  expensedate: string;
  recordedby: string;
  createdat: string;
  expensecategories?: ExpenseCategory;
}

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expensecategories:categoryid (
            categoryid,
            categoryname,
            iseditable
          )
        `)
        .order('expensedate', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ['expenseCategories'],
    queryFn: async (): Promise<ExpenseCategory[]> => {
      const { data, error } = await supabase
        .from('expensecategories')
        .select('*')
        .order('categoryname', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: Omit<Expense, 'expenseid' | 'createdat'>) => {
      const { error } = await supabase
        .from('expenses')
        .insert([expenseData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Despesa adicionada com sucesso!');
    },
    onError: (error) => {
      console.error('Error adding expense:', error);
      toast.error('Erro ao adicionar despesa');
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseid: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('expenseid', expenseid);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Despesa removida!');
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast.error('Erro ao remover despesa');
    },
  });
};
