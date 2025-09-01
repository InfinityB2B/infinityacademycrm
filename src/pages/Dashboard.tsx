import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, TrendingUp, DollarSign } from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Leads",
      value: "1,234",
      change: "+12%",
      icon: Users,
      description: "Novos leads este mês"
    },
    {
      title: "Conversões",
      value: "89",
      change: "+8%",
      icon: Target,
      description: "Taxa de conversão: 7.2%"
    },
    {
      title: "Revenue",
      value: "R$ 45.2K",
      change: "+23%",
      icon: DollarSign,
      description: "Receita mensal"
    },
    {
      title: "Crescimento",
      value: "18.5%",
      change: "+5%",
      icon: TrendingUp,
      description: "Crescimento mensal"
    }
  ]

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
        {stats.map((stat, index) => (
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
                <span className="text-primary font-medium">{stat.change}</span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Atividade Recente</CardTitle>
            <CardDescription>Últimas interações com leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      Novo lead registrado
                    </p>
                    <p className="text-xs text-muted-foreground">João Silva - há 2 horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Metas do Mês</CardTitle>
            <CardDescription>Progresso das metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-card-foreground">Novos Leads</span>
                  <span className="text-muted-foreground">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-card-foreground">Conversões</span>
                  <span className="text-muted-foreground">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard