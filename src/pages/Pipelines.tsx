import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  UniqueIdentifier,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { usePipelines, useUpdateDealStage, Deal, Pipeline, Stage } from "@/hooks/usePipelines";

const formatCurrency = (value?: number) => {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function Pipelines() {
  const [selectedPipeline, setSelectedPipeline] = useState<string>("");
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  
  const { data: pipelines = [], isLoading, isError, error } = usePipelines();
  const updateDealStage = useUpdateDealStage();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Auto-select first pipeline when data loads
  if (pipelines.length > 0 && !selectedPipeline) {
    setSelectedPipeline(pipelines[0].pipelineid);
  }

  const currentPipeline = pipelines.find(p => p.pipelineid === selectedPipeline);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dealId = active.id as string;
    
    // Find the active deal
    const deal = currentPipeline?.stages
      .flatMap(stage => stage.deals)
      .find(deal => deal.dealid === dealId);
    
    setActiveDeal(deal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Find current stage of the deal
    const currentStage = currentPipeline?.stages.find(stage =>
      stage.deals.some(deal => deal.dealid === dealId)
    );

    if (currentStage && currentStage.stageid !== newStageId) {
      updateDealStage.mutate({ dealId, newStageId });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        <div className="flex gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-2 w-full" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-32 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar funis</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Ocorreu um erro inesperado. Tente novamente.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                    <DroppableStage
                      key={stage.stageid}
                      stage={stage}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <DealCard deal={activeDeal} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Droppable Stage Component
interface DroppableStageProps {
  stage: Stage;
}

function DroppableStage({ stage }: DroppableStageProps) {
  const { useDroppable } = require('@dnd-kit/core');
  const { setNodeRef } = useDroppable({
    id: stage.stageid,
  });

  return (
    <div
      ref={setNodeRef}
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
            <DraggableDeal
              key={deal.dealid}
              deal={deal}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Draggable Deal Component
interface DraggableDealProps {
  deal: Deal;
}

function DraggableDeal({ deal }: DraggableDealProps) {
  const { useDraggable } = require('@dnd-kit/core');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: deal.dealid,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <DealCard deal={deal} />
    </div>
  );
}

// Deal Card Component
interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

function DealCard({ deal, isDragging = false }: DealCardProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border border-border ${
        isDragging ? 'shadow-2xl' : ''
      }`}
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
  );
}