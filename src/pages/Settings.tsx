import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Palette, Globe } from "lucide-react"

const Settings = () => {
  const settingsCategories = [
    {
      title: "Perfil",
      icon: User,
      items: [
        { label: "Informações pessoais", description: "Nome, email e foto de perfil", action: "Editar" },
        { label: "Senha", description: "Alterar senha de acesso", action: "Alterar" },
        { label: "Preferências", description: "Idioma e fuso horário", action: "Configurar" }
      ]
    },
    {
      title: "Notificações",
      icon: Bell,
      items: [
        { label: "Email", description: "Notificações por email", toggle: true, enabled: true },
        { label: "Push", description: "Notificações push no navegador", toggle: true, enabled: false },
        { label: "Resumos", description: "Relatórios semanais automáticos", toggle: true, enabled: true }
      ]
    },
    {
      title: "Segurança",
      icon: Shield,
      items: [
        { label: "Autenticação 2FA", description: "Adicionar camada extra de segurança", action: "Configurar" },
        { label: "Sessões ativas", description: "Gerenciar dispositivos conectados", action: "Ver" },
        { label: "Log de atividades", description: "Histórico de acessos", action: "Visualizar" }
      ]
    }
  ]

  const systemSettings = [
    { label: "Backup automático", description: "Backup diário dos dados", enabled: true },
    { label: "Modo de manutenção", description: "Ativar durante atualizações", enabled: false },
    { label: "Logs detalhados", description: "Registrar ações dos usuários", enabled: true },
    { label: "Cache inteligente", description: "Otimizar performance", enabled: true }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do sistema e preferências pessoais
        </p>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: User, label: "Perfil", count: "3 pendentes" },
          { icon: Database, label: "Backup", count: "Último: hoje" },
          { icon: Mail, label: "Email", count: "2 configurados" },
          { icon: Palette, label: "Tema", count: "Escuro ativo" }
        ].map((item, index) => (
          <Card key={index} className="bg-gradient-card border-border shadow-elevation hover:shadow-glow transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <item.icon className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Categories */}
      <div className="space-y-6">
        {settingsCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="bg-gradient-card border-border shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-card-foreground">
                <category.icon className="w-5 h-5 text-primary" />
                <span>{category.title}</span>
              </CardTitle>
              <CardDescription>
                Configurações relacionadas ao {category.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {item.toggle ? (
                        <Switch 
                          checked={item.enabled} 
                          className="data-[state=checked]:bg-primary"
                        />
                      ) : (
                        <Button variant="outline" size="sm" className="hover:bg-muted">
                          {item.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Settings */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-card-foreground">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span>Configurações do Sistema</span>
          </CardTitle>
          <CardDescription>
            Configurações avançadas e de sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={setting.enabled ? "default" : "secondary"}
                    className={setting.enabled ? "bg-primary text-primary-foreground" : ""}
                  >
                    {setting.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch 
                    checked={setting.enabled}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gradient-card border-destructive/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis que podem afetar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div>
                <p className="font-medium text-card-foreground">Resetar Configurações</p>
                <p className="text-sm text-muted-foreground">Voltar às configurações padrão</p>
              </div>
              <Button variant="destructive" size="sm">
                Resetar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div>
                <p className="font-medium text-card-foreground">Limpar Dados</p>
                <p className="text-sm text-muted-foreground">Remover todos os dados do sistema</p>
              </div>
              <Button variant="destructive" size="sm">
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings