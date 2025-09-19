import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserCheck, Loader2, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useSalesTeam, useDeleteSalesPerson } from "@/hooks/useSalesTeam";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SalesTeam() {
  const { data: users, isLoading, isError, error } = useSalesTeam();
  const deleteSalesPersonMutation = useDeleteSalesPerson();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Equipe de Vendas</h1>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando equipe de vendas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Equipe de Vendas</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar a equipe de vendas: {error?.message || 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!users || users.length === 0) {
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

  const handleDeleteUser = (userid: string) => {
    deleteSalesPersonMutation.mutate(userid);
  };

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
                  onClick={() => handleDeleteUser(user.userid)}
                  disabled={deleteSalesPersonMutation.isPending}
                >
                  {deleteSalesPersonMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Remover'
                  )}
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
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Criado em:</span>
                  <span className="font-semibold text-xs">
                    {new Date(user.createdat).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}