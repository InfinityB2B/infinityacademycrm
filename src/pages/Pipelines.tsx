import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Clock, Target } from "lucide-react"

const Pipelines = () => {
  const pipelines = [
    {
      id: 1,
      name: "Vendas Principal",
      description: "Funil principal para conversão de leads",
      stages: 5,
      totalLeads: 124,
      conversionRate: "8.5%",
      status: "Ativo"
    },
    {
      id: 2,
      name: "Retenção de Clientes",
      description: "Estratégias para manter clientes ativos",
      stages: 3,
      totalLeads: 67,
      conversionRate: "12.3%",
      status: "Ativo"
    },
    {
      id: 3,
      name: "Leads Qualificados",
      description: "Processo de qualificação de leads",
      stages: 4,
      totalLeads: 89,
      conversionRate: "15.7%",
      status: "Pausado"
    }
  ]

  const stages = [
    { name: "Novo Lead", count: 45, color: "bg-blue-500" },
    { name: "Qualificação", count: 32, color: "bg-yellow-500" },
    { name: "Proposta", count: 18, color: "bg-orange-500" },
    { name: "Negociação", count: 12, color: "bg-purple-500" },
    { name: "Fechado", count: 8, color: "bg-green-500" }
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funis</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus funis de vendas e conversão
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funil
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Visão Geral do Funil Principal</CardTitle>
            <CardDescription>Status atual do pipeline de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <span className="text-sm font-medium text-card-foreground">{stage.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {stage.count} leads
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Métricas de Performance</CardTitle>
            <CardDescription>Indicadores chave de desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">115</div>
                <div className="text-xs text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">8.5%</div>
                <div className="text-xs text-muted-foreground">Taxa Conversão</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">12d</div>
                <div className="text-xs text-muted-foreground">Tempo Médio</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Plus className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-card-foreground">23</div>
                <div className="text-xs text-muted-foreground">Novos/Semana</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipelines List */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="text-card-foreground">Todos os Funis</CardTitle>
          <CardDescription>Lista completa dos funis configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-card-foreground">{pipeline.name}</h3>
                    <Badge 
                      variant={pipeline.status === "Ativo" ? "default" : "secondary"}
                      className={pipeline.status === "Ativo" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {pipeline.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{pipeline.description}</p>
                  <div className="flex space-x-4 text-xs text-muted-foreground">
                    <span>{pipeline.stages} estágios</span>
                    <span>{pipeline.totalLeads} leads</span>
                    <span>Taxa: {pipeline.conversionRate}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-muted">
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Pipelines