import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function GoalsManagement() {
  const { goals, deleteGoal } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isOverdue = (deadline: Date) => {
    return new Date() > deadline;
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
          description="Defina metas claras para acompanhar o progresso da sua equipe."
          actionLabel="Criar Meta"
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
          Criar Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.currentValue, goal.targetValue);
          const overdue = isOverdue(goal.deadline);
          
          return (
            <Card key={goal.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-card-foreground">{goal.title}</CardTitle>
                  {overdue && (
                    <div className="text-destructive text-sm font-medium">
                      Vencida
                    </div>
                  )}
                </div>
                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {goal.currentValue.toLocaleString('pt-BR')} / {goal.targetValue.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Prazo: {goal.deadline.toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Responsável: {goal.assignedTo}</span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}