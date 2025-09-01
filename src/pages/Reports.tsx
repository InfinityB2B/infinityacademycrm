import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, FileText } from "lucide-react"

const Reports = () => {
  const reports = [
    {
      title: "Relatório de Vendas",
      description: "Análise completa das vendas do mês",
      period: "Janeiro 2024",
      status: "Disponível",
      trend: "up",
      change: "+15.2%"
    },
    {
      title: "Performance de Leads",
      description: "Desempenho da geração de leads",
      period: "Últimos 30 dias",
      status: "Disponível",
      trend: "up",
      change: "+8.7%"
    },
    {
      title: "Conversões por Funil",
      description: "Taxa de conversão detalhada por funil",
      period: "Dezembro 2023",
      status: "Processando",
      trend: "down",
      change: "-2.1%"
    },
    {
      title: "ROI Campanhas",
      description: "Retorno sobre investimento das campanhas",
      period: "Q4 2023",
      status: "Disponível",
      trend: "up",
      change: "+22.4%"
    }
  ]

  const quickStats = [
    { label: "Receita Total", value: "R$ 125.4K", period: "Este mês" },
    { label: "Leads Gerados", value: "1,847", period: "Últimos 30 dias" },
    { label: "Taxa Conversão", value: "12.3%", period: "Média mensal" },
    { label: "Ticket Médio", value: "R$ 2.4K", period: "Este período" }
  ]

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
          <Button variant="outline" className="hover:bg-muted">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border shadow-elevation">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-card-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.period}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Gráfico de Performance</CardTitle>
            <CardDescription>Evolução das métricas principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Gráfico em desenvolvimento</p>
                <p className="text-sm text-muted-foreground mt-1">Dados serão exibidos aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-elevation">
          <CardHeader>
            <CardTitle className="text-card-foreground">Tendências</CardTitle>
            <CardDescription>Análise de tendências mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Vendas</p>
                    <p className="text-xs text-muted-foreground">Crescimento constante</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+18%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Leads</p>
                    <p className="text-xs text-muted-foreground">Aumento significativo</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">+25%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Churn</p>
                    <p className="text-xs text-muted-foreground">Redução positiva</p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">-5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="text-card-foreground">Relatórios Disponíveis</CardTitle>
          <CardDescription>Lista de todos os relatórios gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-medium text-card-foreground">{report.title}</h3>
                      <Badge 
                        variant={report.status === "Disponível" ? "default" : "secondary"}
                        className={report.status === "Disponível" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{report.period}</span>
                      <div className="flex items-center space-x-1">
                        {report.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={report.trend === "up" ? "text-green-500" : "text-red-500"}>
                          {report.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hover:bg-muted"
                  disabled={report.status !== "Disponível"}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports