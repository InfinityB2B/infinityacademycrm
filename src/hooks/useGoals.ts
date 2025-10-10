import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Goal {
  goalid: string
  targetuser?: string
  targetteam?: string
  metric: 'REVENUE' | 'DEALS_WON' | 'APPOINTMENTS_SCHEDULED'
  targetvalue: number
  startdate: string
  enddate: string
  createdat: string
}

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('createdat', { ascending: false })

      if (error) throw error
      return data as Goal[]
    },
  })
}

export function useAddGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goal: Omit<Goal, 'goalid' | 'createdat'>) => {
      const { data, error } = await supabase
        .from('goals')
        .insert([goal])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar meta: ' + error.message)
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('goalid', goalId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta removida com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover meta: ' + error.message)
    },
  })
}
