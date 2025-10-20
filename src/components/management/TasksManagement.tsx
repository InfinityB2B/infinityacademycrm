import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, CheckSquare, Calendar } from "lucide-react";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { TaskForm } from "@/components/forms/TaskForm";

export function TasksManagement() {
  const { data: tasks, isLoading, isError } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleComplete = (taskid: string, completed: boolean) => {
    updateTaskMutation.mutate({ taskid, updates: { completed } });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Tarefas</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Tarefas</h1>
        </div>
        <div className="text-center py-16">
          <p className="text-destructive">Erro ao carregar tarefas. Tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Tarefas</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Tarefa
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 mb-6 text-muted-foreground">
            <CheckSquare size={64} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma Tarefa Encontrada
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Organize seu trabalho criando e gerenciando tarefas aqui.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Criar Tarefa
          </Button>
        </div>

        <TaskForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Tarefas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Tarefa
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.taskid} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    handleToggleComplete(task.taskid, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className={`text-card-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </CardTitle>
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {task.duedate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.duedate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteTaskMutation.mutate(task.taskid)}
                  disabled={deleteTaskMutation.isPending}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}