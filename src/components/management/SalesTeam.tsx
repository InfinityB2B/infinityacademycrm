import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserCheck, Target, Mail } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function SalesTeam() {
  const { salesTeam, addSalesPerson, deleteSalesPerson } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (salesTeam.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Equipe de Vendas</h1>
        </div>
        
        <EmptyState
          icon={<UserCheck size={64} />}
          title="Nenhum Vendedor Encontrado"
          description="Adicione membros à sua equipe de vendas para começar a gerenciar performance."
          actionLabel="Adicionar Vendedor"
          onAction={() => setIsDialogOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Equipe de Vendas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Vendedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesTeam.map((person) => (
          <Card key={person.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">{person.name}</CardTitle>
              <Badge variant="outline">{person.role}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {person.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  <span>Performance: {person.performance}%</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">
                    Meta: R$ {person.targets.toLocaleString('pt-BR')}
                  </span>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteSalesPerson(person.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}