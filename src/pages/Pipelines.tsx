import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Contact {
  contactid: string;
  firstname: string;
  lastname: string;
  company?: string;
}

interface Deal {
  dealid: string;
  dealtitle: string;
  dealvalue?: number;
  status: string;
  stageid: string;
  contacts?: Contact;
}

interface Stage {
  stageid: string;
  stagename: string;
  stageorder: number;
  deals: Deal[];
}

interface Pipeline {
  pipelineid: string;
  pipelinename: string;
  pipelinetype: string;
  stages: Stage[];
}

const formatCurrency = (value?: number) => {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function Pipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("");

  useEffect(() => {
    fetchPipelinesData();
  }, []);

  const fetchPipelinesData = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os pipelines
      const { data: pipelinesData, error: pipelinesError } = await supabase
        .from('pipelines')
        .select('*')
        .order('createdat');

      if (pipelinesError) throw pipelinesError;

      if (!pipelinesData || pipelinesData.length === 0) {
        setPipelines([]);
        setLoading(false);
        return;
      }

      // Buscar stages para cada pipeline
      const { data: stagesData, error: stagesError } = await supabase
        .from('stages')
        .select('*')
        .order('stageorder');

      if (stagesError) throw stagesError;

      // Buscar deals com informações de contatos
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          dealid,
          dealtitle,
          dealvalue,
          status,
          stageid,
          pipelineid,
          contacts:contactid (
            contactid,
            firstname,
            lastname,
            company
          )
        `)
        .eq('status', 'OPEN');

      if (dealsError) throw dealsError;

      // Organizar dados em estrutura hierárquica
      const pipelinesWithStages = pipelinesData.map(pipeline => {
        const pipelineStages = stagesData
          ?.filter(stage => stage.pipelineid === pipeline.pipelineid)
          ?.map(stage => ({
            ...stage,
            deals: dealsData?.filter(deal => deal.stageid === stage.stageid) || []
          })) || [];

        return {
          ...pipeline,
          stages: pipelineStages
        };
      });

      setPipelines(pipelinesWithStages);
      
      // Selecionar primeiro pipeline por padrão
      if (pipelinesWithStages.length > 0 && !selectedPipeline) {
        setSelectedPipeline(pipelinesWithStages[0].pipelineid);
      }

    } catch (error) {
      console.error('Erro ao buscar dados dos funis:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPipeline = pipelines.find(p => p.pipelineid === selectedPipeline);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Carregando funis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Funis de Vendas
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie suas oportunidades de negócio
          </p>
        </div>
        
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {pipelines.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum funil encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro funil de vendas.
            </p>
            <Button className="bg-gradient-primary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Primeiro Funil
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pipeline Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pipelines.map((pipeline) => (
              <Button
                key={pipeline.pipelineid}
                variant={selectedPipeline === pipeline.pipelineid ? "default" : "outline"}
                onClick={() => setSelectedPipeline(pipeline.pipelineid)}
                className={`whitespace-nowrap ${
                  selectedPipeline === pipeline.pipelineid 
                    ? "bg-gradient-primary text-white" 
                    : "hover:bg-muted"
                }`}
              >
                {pipeline.pipelinename}
                <Badge variant="secondary" className="ml-2">
                  {pipeline.pipelinetype}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Kanban Board */}
          {currentPipeline && (
            <div className="overflow-x-auto">
              <div className="flex gap-6 min-w-max pb-4">
                {currentPipeline.stages.map((stage) => (
                  <div
                    key={stage.stageid}
                    className="flex-shrink-0 w-80"
                  >
                    {/* Stage Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {stage.stagename}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {stage.deals.length}
                        </Badge>
                      </div>
                      <div className="h-1 bg-gradient-primary rounded-full" />
                    </div>

                    {/* Stage Content */}
                    <div className="space-y-3 min-h-[400px]">
                      {stage.deals.length === 0 ? (
                        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                          <div className="text-muted-foreground">
                            <PlusCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhuma oportunidade aqui</p>
                            <p className="text-xs mt-1">
                              Arraste deals para este estágio ou crie um novo
                            </p>
                          </div>
                        </div>
                      ) : (
                        stage.deals.map((deal) => (
                          <Card
                            key={deal.dealid}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border border-border"
                            style={{ backgroundColor: '#101118' }}
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-card-foreground leading-tight">
                                {deal.dealtitle}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                {/* Deal Value */}
                                <div className="text-lg font-bold text-green-400">
                                  {formatCurrency(deal.dealvalue)}
                                </div>
                                
                                {/* Contact Info */}
                                {deal.contacts && (
                                  <div className="text-xs text-muted-foreground">
                                    <div className="font-medium">
                                      {deal.contacts.firstname} {deal.contacts.lastname}
                                    </div>
                                    {deal.contacts.company && (
                                      <div className="opacity-75">
                                        {deal.contacts.company}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className="flex justify-between items-center">
                                  <Badge 
                                    variant={deal.status === 'OPEN' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {deal.status === 'OPEN' ? 'Aberto' : deal.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}