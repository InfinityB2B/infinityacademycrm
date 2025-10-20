import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  userid: string;
  firstname: string;
  lastname: string;
  email: string;
  profilepictureurl?: string;
  roleid?: string;
  teamid?: string;
}

interface UpdateUserProfileData {
  firstname?: string;
  lastname?: string;
  profilepictureurl?: string;
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', userId)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile | null;
    },
    enabled: !!userId,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: UpdateUserProfileData;
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('userid', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar perfil: ' + error.message);
    },
  });
}
