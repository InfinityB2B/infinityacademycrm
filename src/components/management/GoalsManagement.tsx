import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function GoalsManagement() {
  const { goals, deleteGoal } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isOverdue = (enddate: string): boolean => {
    return new Date() > new Date(enddate);
  };

  if (goals.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Metas</h1>
        </div>
        
        <EmptyState
          icon={<Target size={64} />}
          title="Nenhuma Meta Encontrada"
          description="Defina metas para acompanhar o progresso da sua equipe."
          actionLabel="Adicionar Meta"
          onAction={() => setIsDialogOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Metas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Meta
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.goalid} className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-card-foreground">Meta {goal.metric}</CardTitle>
                  <p className="text-muted-foreground">Valor alvo: {goal.targetvalue.toLocaleString('pt-BR')}</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteGoal(goal.goalid)}
                >
                  Remover
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Início:</span>
                    <span className="ml-2 font-semibold">{new Date(goal.startdate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fim:</span>
                    <span className={`ml-2 ${isOverdue(goal.enddate) ? 'text-destructive' : 'text-foreground'}`}>
                      {new Date(goal.enddate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-muted-foreground">Target User:</span>
                    <span className="ml-2 font-semibold">{goal.targetuser || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Team:</span>
                    <span className="ml-2 font-semibold">{goal.targetteam || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}