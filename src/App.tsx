import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pipelines from "./pages/Pipelines";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import FinancialManagement from "./pages/FinancialManagement";
import WebhookSettings from "./pages/WebhookSettings";
import { DealsManagement } from "./components/management/DealsManagement";
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
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/pipelines" element={<ProtectedRoute><AppLayout><Pipelines /></AppLayout></ProtectedRoute>} />
          <Route path="/leads" element={<ProtectedRoute><AppLayout><DealsManagement /></AppLayout></ProtectedRoute>} />
          <Route path="/sales-team" element={<ProtectedRoute><AppLayout><SalesTeam /></AppLayout></ProtectedRoute>} />
          <Route path="/financial" element={<ProtectedRoute><AppLayout><FinancialManagement /></AppLayout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><AppLayout><GoalsManagement /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
          <Route path="/webhooks" element={<ProtectedRoute><AppLayout><WebhookSettings /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
