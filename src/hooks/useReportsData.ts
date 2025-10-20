import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

interface DealStatusData {
  name: string;
  value: number;
  fill: string;
}

interface ExpenseByCategoryData {
  name: string;
  value: number;
  fill: string;
}

export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('dealvalue, wonat, createdat')
        .eq('status', 'WON')
        .not('dealvalue', 'is', null);

      if (error) throw error;

      // Group by month and sum revenue
      const revenueByMonth = data.reduce((acc, deal) => {
        const date = deal.wonat || deal.createdat;
        if (!date) return acc;
        
        const monthKey = format(startOfMonth(parseISO(date)), 'MMM', { locale: ptBR });
        
        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += Number(deal.dealvalue);
        return acc;
      }, {} as Record<string, number>);

      // Convert to array format for charts
      const formattedData: MonthlyRevenueData[] = Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({
          month: month.charAt(0).toUpperCase() + month.slice(1),
          revenue: Number(revenue.toFixed(2))
        }))
        .slice(-6); // Last 6 months

      return formattedData;
    }
  });
};

export const useDealStatusDistribution = () => {
  return useQuery({
    queryKey: ['dealStatusDistribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('status');

      if (error) throw error;

      // Count by status
      const statusCounts = data.reduce((acc, deal) => {
        if (!acc[deal.status]) {
          acc[deal.status] = 0;
        }
        acc[deal.status]++;
        return acc;
      }, {} as Record<string, number>);

      // Format for pie chart with colors
      const colors = {
        OPEN: 'hsl(var(--chart-1))',
        WON: 'hsl(var(--chart-2))',
        LOST: 'hsl(var(--chart-3))'
      };

      const formattedData: DealStatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
        name: status === 'OPEN' ? 'Aberto' : status === 'WON' ? 'Ganho' : 'Perdido',
        value: count,
        fill: colors[status as keyof typeof colors] || 'hsl(var(--chart-4))'
      }));

      return formattedData;
    }
  });
};

export const useExpensesByCategory = () => {
  return useQuery({
    queryKey: ['expensesByCategory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, categoryid, expensecategories(categoryname)')
        .not('amount', 'is', null);

      if (error) throw error;

      // Group by category and sum amounts
      const expensesByCategory = data.reduce((acc, expense) => {
        const categoryName = (expense.expensecategories as any)?.categoryname || 'Outros';
        
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      // Format for pie chart with colors
      const chartColors = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))'
      ];

      const formattedData: ExpenseByCategoryData[] = Object.entries(expensesByCategory).map(([category, amount], index) => ({
        name: category,
        value: Number(amount.toFixed(2)),
        fill: chartColors[index % chartColors.length]
      }));

      return formattedData;
    }
  });
};

export const useQuickStats = () => {
  return useQuery({
    queryKey: ['quickStats'],
    queryFn: async () => {
      // Get total revenue (deals WON)
      const { data: wonDeals, error: wonError } = await supabase
        .from('deals')
        .select('dealvalue')
        .eq('status', 'WON')
        .not('dealvalue', 'is', null);

      if (wonError) throw wonError;

      const totalRevenue = wonDeals.reduce((sum, deal) => sum + Number(deal.dealvalue), 0);

      // Get total leads (contacts)
      const { count: leadsCount, error: leadsError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (leadsError) throw leadsError;

      // Get conversion rate
      const { count: totalDeals, error: totalDealsError } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true });

      if (totalDealsError) throw totalDealsError;

      const conversionRate = totalDeals && wonDeals.length > 0
        ? ((wonDeals.length / totalDeals) * 100).toFixed(1)
        : '0.0';

      // Calculate average ticket
      const avgTicket = wonDeals.length > 0
        ? (totalRevenue / wonDeals.length).toFixed(2)
        : '0';

      return {
        totalRevenue: totalRevenue.toFixed(2),
        leadsCount: leadsCount || 0,
        conversionRate,
        avgTicket
      };
    }
  });
};
