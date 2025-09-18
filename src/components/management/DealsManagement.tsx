import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { DealForm } from "@/components/forms/DealForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DealsManagement() {
  const { deals, addDeal, updateDeal, deleteDeal } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDeal = (dealData: any) => {
    addDeal(dealData);
    setIsDialogOpen(false);
  };

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Deal</DialogTitle>
            </DialogHeader>
            <DealForm onSubmit={handleAddDeal} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Deals</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Deal</DialogTitle>
            </DialogHeader>
            <DealForm onSubmit={handleAddDeal} />
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
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteDeal(deal.dealid)}
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