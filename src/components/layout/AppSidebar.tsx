import { BarChart3, Home, Settings, Workflow, TrendingUp, Users, UserCheck, Target, Webhook } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Funis", url: "/pipelines", icon: Workflow },
  { title: "Deals", url: "/leads", icon: Users },
  { title: "Equipe", url: "/sales-team", icon: UserCheck },
  { title: "Financeiro", url: "/financial", icon: TrendingUp },
  { title: "Metas", url: "/goals", icon: Target },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Webhooks", url: "/webhooks", icon: Webhook },
  { title: "Configurações", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()

  const isCollapsed = state === "collapsed"
  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-glow" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-64"} border-r border-sidebar-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className={isCollapsed ? "sr-only" : ""}>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Infinity</h1>
              <p className="text-sm text-sidebar-foreground/60">Academy CRM</p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-4">
            Navegação
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end>
                      <div className={`${getNavCls(isActive)} flex items-center p-2 rounded-md transition-colors`}>
                        <item.icon className="h-5 w-5" />
                        <span className={`ml-3 ${isCollapsed ? 'sr-only' : ''}`}>{item.title}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}