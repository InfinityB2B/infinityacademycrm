import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserCheck, Mail } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function SalesTeam() {
  const { users, deleteUser } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (users.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Equipe de Vendas</h1>
        </div>
        
        <EmptyState
          icon={<UserCheck size={64} />}
          title="Nenhum Usuário Encontrado"
          description="Adicione membros à sua equipe para começar a gerenciar."
          actionLabel="Adicionar Usuário"
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
          Adicionar Usuário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.userid} className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-card-foreground">{user.firstname} {user.lastname}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {user.userid.slice(0, 8)}...</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteUser(user.userid)}
                >
                  Remover
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Team ID:</span>
                  <span className="font-semibold">{user.teamid || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role ID:</span>
                  <span className="font-semibold">{user.roleid || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}