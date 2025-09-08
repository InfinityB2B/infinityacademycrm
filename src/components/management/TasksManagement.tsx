import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, CheckSquare, Calendar, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function TasksManagement() {
  const { tasks, updateTask, deleteTask } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Tarefas</h1>
        </div>
        
        <EmptyState
          icon={<CheckSquare size={64} />}
          title="Nenhuma Tarefa Encontrada"
          description="Organize seu trabalho criando e gerenciando tarefas aqui."
          actionLabel="Criar Tarefa"
          onAction={() => setIsDialogOpen(true)}
        />
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
          <Card key={task.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => 
                    handleToggleComplete(task.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className={`text-card-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </CardTitle>
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority}
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
                  <span>Responsável: {task.assignedTo}</span>
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate.toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}