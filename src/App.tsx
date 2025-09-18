import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pipelines from "./pages/Pipelines";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LeadsManagement } from "./components/management/LeadsManagement";
import { SalesTeam } from "./components/management/SalesTeam";
import { GoalsManagement } from "./components/management/GoalsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/pipelines" element={<AppLayout><Pipelines /></AppLayout>} />
          <Route path="/leads" element={<AppLayout><LeadsManagement /></AppLayout>} />
          <Route path="/sales-team" element={<AppLayout><SalesTeam /></AppLayout>} />
          <Route path="/financial" element={<AppLayout><div className="p-6"><h1 className="text-3xl font-bold">Financeiro</h1><p className="text-muted-foreground">Módulo em desenvolvimento</p></div></AppLayout>} />
          <Route path="/goals" element={<AppLayout><GoalsManagement /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
          <Route path="/webhooks" element={<AppLayout><div className="p-6"><h1 className="text-3xl font-bold">Webhooks</h1><p className="text-muted-foreground">Módulo em desenvolvimento</p></div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
