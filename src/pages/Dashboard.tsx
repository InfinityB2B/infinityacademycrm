import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { useDashboardStats, useRecentDeals, useMonthlyGoalsProgress } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: recentDeals, isLoading: dealsLoading, isError: dealsError } = useRecentDeals();
  const { data: goals, isLoading: goalsLoading, isError: goalsError } = useMonthlyGoalsProgress();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      REVENUE: 'Receita',
      DEALS_WON: 'Deals Ganhos',
      APPOINTMENTS_SCHEDULED: 'Agendamentos',
    };
    return labels[metric] || metric;
  };

  const statsCards = stats ? [
    {
      title: "Total de Leads",
      value: stats.totalLeads.toString(),
      change: formatGrowth(stats.leadsGrowth),
      icon: Users,
      description: "Novos leads este mês"
    },
    {
      title: "Conversões",
      value: stats.conversions.toString(),
      change: formatGrowth(stats.conversionsGrowth),
      icon: Target,
      description: `Taxa de conversão: ${stats.conversionRate.toFixed(1)}%`
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.revenue),
      change: formatGrowth(stats.revenueGrowth),
      icon: DollarSign,
      description: "Receita mensal"
    },
    {
      title: "Crescimento",
      value: `${stats.revenueGrowth.toFixed(1)}%`,
      change: formatGrowth(stats.revenueGrowth),
      icon: TrendingUp,
      description: "Crescimento mensal"
    }
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do desempenho da Infinity Academy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : statsError ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-muted-foreground">Erro ao carregar estatísticas</p>
            </div>
          </div>
        ) : (
          statsCards.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border shadow-elevation hover:shadow-glow transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`font-medium ${
                    stat.change.startsWith('+') ? 'text-green-500' : 
                    stat.change.startsWith('-') ? 'text-red-500' : 
                    'text-primary'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Atividade Recente</CardTitle>
            <CardDescription>Últimas interações com leads</CardDescription>
          </CardHeader>
          <CardContent>
            {dealsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dealsError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground">Erro ao carregar atividades</p>
              </div>
            ) : !recentDeals || recentDeals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <div key={deal.dealid} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {deal.dealtitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {deal.contactName} - {formatDistanceToNow(new Date(deal.createdat), { 
                          addSuffix: true,
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Metas do Mês</CardTitle>
            <CardDescription>Progresso das metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : goalsError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground">Erro ao carregar metas</p>
              </div>
            ) : !goals || goals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Nenhuma meta definida para este mês</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.goalid}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-card-foreground">{getMetricLabel(goal.metric)}</span>
                      <span className="text-muted-foreground">{goal.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>
                        {goal.metric === 'REVENUE' 
                          ? formatCurrency(goal.currentValue)
                          : goal.currentValue}
                      </span>
                      <span>
                        Meta: {goal.metric === 'REVENUE' 
                          ? formatCurrency(goal.targetvalue)
                          : goal.targetvalue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
