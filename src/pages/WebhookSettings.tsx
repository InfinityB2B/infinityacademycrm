import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Link as LinkIcon,
  Power,
  PowerOff 
} from 'lucide-react';
import { WebhookForm } from '@/components/forms/WebhookForm';
import { 
  useWebhooks, 
  useAddWebhook, 
  useDeleteWebhook,
  useUpdateWebhook 
} from '@/hooks/useWebhooks';
import { Skeleton } from '@/components/ui/skeleton';

import { toast } from 'sonner';
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
} from '@/components/ui/alert-dialog';

const WebhookSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: webhooks, isLoading, isError } = useWebhooks();
  const addWebhookMutation = useAddWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const updateWebhookMutation = useUpdateWebhook();

  const handleAddWebhook = (data: any) => {
    addWebhookMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  const handleDeleteWebhook = (webhookid: string) => {
    deleteWebhookMutation.mutate(webhookid);
  };

  const handleToggleActive = (webhookid: string, currentStatus: boolean) => {
    updateWebhookMutation.mutate({
      webhookid,
      isactive: !currentStatus,
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência!');
  };

  const obfuscateUrl = (url: string) => {
    if (url.length <= 40) return url;
    return url.substring(0, 35) + '...' + url.substring(url.length - 10);
  };

  const getEventLabel = (event: string) => {
    const labels: Record<string, string> = {
      new_lead: 'Novo Lead',
      deal_won: 'Deal Ganho',
      deal_lost: 'Deal Perdido',
    };
    return labels[event] || event;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações de Webhook</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie integrações e receba leads de fontes externas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-gradient-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Criar Novo Webhook</DialogTitle>
              <DialogDescription>
                Configure um webhook para receber dados de fontes externas
              </DialogDescription>
            </DialogHeader>
            <WebhookForm onSubmit={handleAddWebhook} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="text-card-foreground">Webhooks Ativos</CardTitle>
          <CardDescription>
            Lista de todos os webhooks configurados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Erro ao carregar webhooks. Tente novamente.
            </div>
          ) : !webhooks || webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LinkIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Nenhum webhook configurado
              </h3>
              <p className="text-muted-foreground max-w-md">
                Crie seu primeiro webhook para começar a receber leads de fontes externas
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Nome</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.webhookid} className="border-border">
                      <TableCell className="font-medium text-card-foreground">
                        {webhook.webhookname}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {obfuscateUrl(webhook.targeturl)}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {getEventLabel(webhook.event)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={webhook.isactive ? 'default' : 'secondary'}
                          className={
                            webhook.isactive
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }
                        >
                          {webhook.isactive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyUrl(webhook.targeturl)}
                            title="Copiar URL"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(webhook.webhookid, webhook.isactive)}
                            title={webhook.isactive ? 'Desativar' : 'Ativar'}
                          >
                            {webhook.isactive ? (
                              <PowerOff className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <Power className="w-4 h-4 text-green-500" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Excluir">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gradient-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-card-foreground">
                                  Confirmar Exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o webhook "{webhook.webhookname}"?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWebhook(webhook.webhookid)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="text-card-foreground">Como Usar</CardTitle>
          <CardDescription>
            Instruções para integrar com fontes externas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">1. Crie um Webhook</h3>
            <p className="text-sm text-muted-foreground">
              Clique em "Criar Novo Webhook" e preencha as informações necessárias.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">2. Copie a URL</h3>
            <p className="text-sm text-muted-foreground">
              Após criar, copie a URL do webhook usando o botão de copiar.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">3. Configure na Fonte</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Cole a URL na sua fonte de leads (Facebook Ads, Google Ads, etc.).
            </p>
            <div className="bg-muted/30 p-4 rounded-lg mt-2">
              <p className="text-xs font-mono text-muted-foreground mb-2">Formato esperado (JSON):</p>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 99999-9999",
  "company": "Empresa XYZ",
  "value": 5000
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;
