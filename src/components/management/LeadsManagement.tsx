import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Mail, Phone, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LeadsManagement() {
  const { leads, addLead, updateLead, deleteLead } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddLead = (leadData: any) => {
    addLead(leadData);
    setIsDialogOpen(false);
  };

  if (leads.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Leads</h1>
        </div>
        
        <EmptyState
          icon={<Users size={64} />}
          title="Nenhum Lead Encontrado"
          description="Comece adicionando seu primeiro lead para vê-lo aqui."
          actionLabel="Adicionar Lead"
          onAction={() => setIsDialogOpen(true)}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <LeadForm onSubmit={handleAddLead} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Leads</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <LeadForm onSubmit={handleAddLead} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-card-foreground">{lead.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {lead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </span>
                    {lead.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {lead.company}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">{lead.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteLead(lead.id)}
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