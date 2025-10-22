import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Building2, Loader2, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { DealForm } from "@/components/forms/DealForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useDeals, useAddDeal, useUpdateDeal, useDeleteDeal, Deal } from "@/hooks/useDeals";

export function DealsManagement() {
  const { data: deals = [], isLoading, isError, error } = useDeals();
  const addDealMutation = useAddDeal();
  const updateDealMutation = useUpdateDeal();
  const deleteDealMutation = useDeleteDeal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const handleAddDeal = (dealData: any) => {
    addDealMutation.mutate(dealData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setEditingDeal(null);
      },
    });
  };

  const handleUpdateDeal = (dealData: any) => {
    if (editingDeal) {
      updateDealMutation.mutate(
        { dealid: editingDeal.dealid, updates: dealData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingDeal(null);
          },
        }
      );
    }
  };

  const handleEditClick = (deal: Deal) => {
    setEditingDeal(deal);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingDeal(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold text-foreground">Gestão de Deals</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar deals</h3>
            <p className="text-muted-foreground">
              {error?.message || 'Ocorreu um erro inesperado.'}
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Deals</h1>
        </div>
        
        <EmptyState
          icon={<Users size={64} />}
          title="Nenhum Deal Encontrado"
          description="Comece adicionando seu primeiro deal para vê-lo aqui."
          actionLabel="Adicionar Deal"
          onAction={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDeal ? "Editar Deal" : "Adicionar Novo Deal"}</DialogTitle>
            </DialogHeader>
            <DealForm 
              onSubmit={editingDeal ? handleUpdateDeal : handleAddDeal}
              initialData={editingDeal || undefined}
              isEdit={!!editingDeal}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Deals</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDeal ? "Editar Deal" : "Adicionar Novo Deal"}</DialogTitle>
            </DialogHeader>
            <DealForm 
              onSubmit={editingDeal ? handleUpdateDeal : handleAddDeal}
              initialData={editingDeal || undefined}
              isEdit={!!editingDeal}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.dealid} className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-card-foreground">{deal.dealtitle}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      ID: {deal.dealid.slice(0, 8)}...
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{deal.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  R$ {deal.dealvalue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditClick(deal)}
                  >
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={deleteDealMutation.isPending}
                      >
                        {deleteDealMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
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
                          Tem certeza que deseja excluir o deal "{deal.dealtitle}"?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteDealMutation.mutate(deal.dealid)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}