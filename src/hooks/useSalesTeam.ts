import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface SalesUser {
  userid: string
  firstname: string
  lastname: string
  email: string
  passwordhash: string
  profilepictureurl?: string
  roleid?: string
  teamid?: string
  createdat: string
}

type NewSalesUser = Omit<SalesUser, 'userid' | 'createdat'>

export function useSalesTeam() {
  return useQuery({
    queryKey: ['salesTeam'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdat', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as SalesUser[]
    },
  })
}

export function useAddSalesPerson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: NewSalesUser) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()

      if (error) {
        throw new Error(error.message)
      }

      return data[0] as SalesUser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesTeam'] })
      toast.success('Usuário adicionado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar usuário: ${error.message}`)
    },
  })
}

export function useDeleteSalesPerson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userid: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('userid', userid)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesTeam'] })
      toast.success('Usuário removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover usuário: ${error.message}`)
    },
  })
}