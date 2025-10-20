import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, BarChart3 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useMonthlyRevenue, useDealStatusDistribution, useExpensesByCategory, useQuickStats } from "@/hooks/useReportsData"
import { Skeleton } from "@/components/ui/skeleton"

const Reports = () => {
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useMonthlyRevenue()
  const { data: dealStatus, isLoading: isLoadingDeals } = useDealStatusDistribution()
  const { data: expensesByCategory, isLoading: isLoadingExpenses } = useExpensesByCategory()
  const { data: quickStats, isLoading: isLoadingStats } = useQuickStats()

  const revenueChartConfig = {
    revenue: {
      label: "Receita",
      color: "hsl(var(--chart-1))",
    },
  }

  const dealStatusChartConfig = {
    Aberto: {
      label: "Aberto",
      color: "hsl(var(--chart-1))",
    },
    Ganho: {
      label: "Ganho",
      color: "hsl(var(--chart-2))",
    },
    Perdido: {
      label: "Perdido",
      color: "hsl(var(--chart-3))",
    },
  }

  const expensesChartConfig = {
    value: {
      label: "Valor",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Análises e insights detalhados sobre o desempenho
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hover:bg-muted" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground" disabled>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gradient-card border-border shadow-elevation">
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="bg-gradient-card border-border shadow-elevation">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-card-foreground mb-1">
                  R$ {Number(quickStats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Receita Total</div>
                <div className="text-xs text-muted-foreground">Deals ganhos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border shadow-elevation">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-card-foreground mb-1">
                  {quickStats?.leadsCount || 0}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Leads Gerados</div>
                <div className="text-xs text-muted-foreground">Total de contatos</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border shadow-elevation">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-card-foreground mb-1">
                  {quickStats?.conversionRate || 0}%
                </div>
                <div className="text-sm text-muted-foreground mb-1">Taxa Conversão</div>
                <div className="text-xs text-muted-foreground">Deals ganhos / total</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border shadow-elevation">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-card-foreground mb-1">
                  R$ {Number(quickStats?.avgTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground mb-1">Ticket Médio</div>
                <div className="text-xs text-muted-foreground">Por deal ganho</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Receita Mensal</CardTitle>
            <CardDescription>Evolução das vendas nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : monthlyRevenue && monthlyRevenue.length > 0 ? (
              <ChartContainer config={revenueChartConfig} className="h-64">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum dado disponível</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deal Status Distribution Chart */}
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Distribuição de Deals</CardTitle>
            <CardDescription>Status atual dos negócios</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDeals ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : dealStatus && dealStatus.length > 0 ? (
              <ChartContainer config={dealStatusChartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={dealStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dealStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum deal cadastrado</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category Chart */}
        <Card className="bg-gradient-card border-border shadow-elevation lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingExpenses ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : expensesByCategory && expensesByCategory.length > 0 ? (
              <ChartContainer config={expensesChartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma despesa cadastrada</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports
