import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, startOfDay, subMonths } from 'date-fns';

interface DashboardStats {
  totalLeads: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  leadsGrowth: number;
  conversionsGrowth: number;
  revenueGrowth: number;
}

interface RecentDeal {
  dealid: string;
  dealtitle: string;
  createdat: string;
  contactid?: string;
  contactName?: string;
}

interface MonthlyGoal {
  goalid: string;
  metric: string;
  targetvalue: number;
  currentValue: number;
  progress: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Total de leads (deals) do mês atual
      const { data: currentDeals, error: currentDealsError } = await supabase
        .from('deals')
        .select('dealid, status, dealvalue')
        .gte('createdat', currentMonthStart.toISOString())
        .lte('createdat', currentMonthEnd.toISOString());

      if (currentDealsError) throw currentDealsError;

      // Deals do mês anterior para comparação
      const { data: lastMonthDeals, error: lastMonthDealsError } = await supabase
        .from('deals')
        .select('dealid, status, dealvalue')
        .gte('createdat', lastMonthStart.toISOString())
        .lte('createdat', lastMonthEnd.toISOString());

      if (lastMonthDealsError) throw lastMonthDealsError;

      const totalLeads = currentDeals?.length || 0;
      const conversions = currentDeals?.filter(d => d.status === 'WON').length || 0;
      const revenue = currentDeals
        ?.filter(d => d.status === 'WON')
        .reduce((sum, d) => sum + (Number(d.dealvalue) || 0), 0) || 0;

      const lastMonthLeads = lastMonthDeals?.length || 0;
      const lastMonthConversions = lastMonthDeals?.filter(d => d.status === 'WON').length || 0;
      const lastMonthRevenue = lastMonthDeals
        ?.filter(d => d.status === 'WON')
        .reduce((sum, d) => sum + (Number(d.dealvalue) || 0), 0) || 0;

      const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;
      const leadsGrowth = lastMonthLeads > 0 
        ? ((totalLeads - lastMonthLeads) / lastMonthLeads) * 100 
        : 0;
      const conversionsGrowth = lastMonthConversions > 0
        ? ((conversions - lastMonthConversions) / lastMonthConversions) * 100
        : 0;
      const revenueGrowth = lastMonthRevenue > 0
        ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

      return {
        totalLeads,
        conversions,
        revenue,
        conversionRate,
        leadsGrowth,
        conversionsGrowth,
        revenueGrowth,
      };
    },
  });
}

export function useRecentDeals() {
  return useQuery({
    queryKey: ['recentDeals'],
    queryFn: async (): Promise<RecentDeal[]> => {
      const { data: deals, error } = await supabase
        .from('deals')
        .select('dealid, dealtitle, createdat, contactid')
        .order('createdat', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Buscar nomes dos contatos
      const dealsWithContacts = await Promise.all(
        (deals || []).map(async (deal) => {
          if (deal.contactid) {
            const { data: contact } = await supabase
              .from('contacts')
              .select('firstname, lastname')
              .eq('contactid', deal.contactid)
              .maybeSingle();

            return {
              ...deal,
              contactName: contact 
                ? `${contact.firstname} ${contact.lastname}` 
                : 'Contato não encontrado',
            };
          }
          return {
            ...deal,
            contactName: 'Sem contato',
          };
        })
      );

      return dealsWithContacts as RecentDeal[];
    },
  });
}

export function useMonthlyGoalsProgress() {
  return useQuery({
    queryKey: ['monthlyGoals'],
    queryFn: async (): Promise<MonthlyGoal[]> => {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);

      // Buscar metas ativas do mês
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .lte('startdate', currentMonthEnd.toISOString().split('T')[0])
        .gte('enddate', currentMonthStart.toISOString().split('T')[0]);

      if (goalsError) throw goalsError;

      // Buscar dados de deals do mês para calcular progresso
      const { data: currentDeals, error: dealsError } = await supabase
        .from('deals')
        .select('status, dealvalue')
        .gte('createdat', currentMonthStart.toISOString())
        .lte('createdat', currentMonthEnd.toISOString());

      if (dealsError) throw dealsError;

      const monthlyGoals: MonthlyGoal[] = (goals || []).map((goal) => {
        let currentValue = 0;

        switch (goal.metric) {
          case 'REVENUE':
            currentValue = currentDeals
              ?.filter(d => d.status === 'WON')
              .reduce((sum, d) => sum + (Number(d.dealvalue) || 0), 0) || 0;
            break;
          case 'DEALS_WON':
            currentValue = currentDeals?.filter(d => d.status === 'WON').length || 0;
            break;
          case 'APPOINTMENTS_SCHEDULED':
            // Aqui você pode adicionar lógica específica se tiver uma tabela de agendamentos
            currentValue = 0;
            break;
          default:
            currentValue = 0;
        }

        const progress = goal.targetvalue > 0 
          ? Math.min((currentValue / Number(goal.targetvalue)) * 100, 100)
          : 0;

        return {
          goalid: goal.goalid,
          metric: goal.metric,
          targetvalue: Number(goal.targetvalue),
          currentValue,
          progress,
        };
      });

      return monthlyGoals;
    },
  });
}
