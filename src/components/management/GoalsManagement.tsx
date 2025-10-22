import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useGoals, useAddGoal, useDeleteGoal } from "@/hooks/useGoals";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoalForm } from "@/components/forms/GoalForm";

export function GoalsManagement() {
  const { data: goals, isLoading, isError } = useGoals();
  const addGoalMutation = useAddGoal();
  const deleteGoalMutation = useDeleteGoal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddGoal = (data: any) => {
    addGoalMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  const isOverdue = (enddate: string): boolean => {
    return new Date() > new Date(enddate);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Metas</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Metas</h1>
        </div>
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Erro ao carregar as metas. Tente novamente mais tarde.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={deleteGoalMutation.isPending}
                    >
                      {deleteGoalMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Removendo...
                        </>
                      ) : (
                        'Remover'
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gradient-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-card-foreground">
                        Confirmar Exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a meta "{goal.metric}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteGoalMutation.mutate(goal.goalid)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Meta</DialogTitle>
          </DialogHeader>
          <GoalForm onSubmit={handleAddGoal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}