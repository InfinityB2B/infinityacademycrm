-- Criar tipos ENUM necessários
CREATE TYPE public.pipeline_type AS ENUM ('PROSPECTING', 'SALES', 'POST_SALES');
CREATE TYPE public.deal_status AS ENUM ('OPEN', 'WON', 'LOST');
CREATE TYPE public.goal_metric AS ENUM ('REVENUE', 'DEALS_WON', 'APPOINTMENTS_SCHEDULED');

-- Tabela users
CREATE TABLE public.users (
    userId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    profilePictureUrl TEXT,
    roleId UUID,
    teamId UUID,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela teams
CREATE TABLE public.teams (
    teamId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    teamName TEXT NOT NULL,
    ownerId UUID,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela contacts
CREATE TABLE public.contacts (
    contactId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    isClient BOOLEAN NOT NULL DEFAULT false,
    importedBy UUID,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela pipelines
CREATE TABLE public.pipelines (
    pipelineId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pipelineName TEXT NOT NULL,
    pipelineType public.pipeline_type NOT NULL,
    isEditable BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela stages
CREATE TABLE public.stages (
    stageId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    stageName TEXT NOT NULL,
    pipelineId UUID NOT NULL,
    stageOrder INTEGER NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela deals
CREATE TABLE public.deals (
    dealId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    dealTitle TEXT NOT NULL,
    dealValue NUMERIC(10,2),
    status public.deal_status NOT NULL DEFAULT 'OPEN',
    contactId UUID,
    ownerId UUID,
    stageId UUID NOT NULL,
    pipelineId UUID NOT NULL,
    wonAt TIMESTAMP WITH TIME ZONE,
    lostAt TIMESTAMP WITH TIME ZONE,
    lostReason TEXT,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela tags
CREATE TABLE public.tags (
    tagId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tagName TEXT NOT NULL,
    tagColor TEXT NOT NULL
);

-- Tabela dealTags (many-to-many)
CREATE TABLE public.dealTags (
    dealId UUID NOT NULL,
    tagId UUID NOT NULL,
    PRIMARY KEY (dealId, tagId)
);

-- Tabela expenseCategories
CREATE TABLE public.expenseCategories (
    categoryId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    categoryName TEXT NOT NULL,
    isEditable BOOLEAN NOT NULL DEFAULT true
);

-- Tabela expenses
CREATE TABLE public.expenses (
    expenseId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    categoryId UUID NOT NULL,
    expenseDate DATE NOT NULL,
    recordedBy UUID NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela goals
CREATE TABLE public.goals (
    goalId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    targetUser UUID,
    targetTeam UUID,
    metric public.goal_metric NOT NULL,
    targetValue NUMERIC(10,2) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela webhooks
CREATE TABLE public.webhooks (
    webhookId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    webhookName TEXT NOT NULL,
    targetUrl TEXT NOT NULL,
    event TEXT NOT NULL,
    linkedPipelineId UUID,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar chaves estrangeiras
ALTER TABLE public.users ADD CONSTRAINT fk_users_team FOREIGN KEY (teamId) REFERENCES public.teams(teamId);
ALTER TABLE public.teams ADD CONSTRAINT fk_teams_owner FOREIGN KEY (ownerId) REFERENCES public.users(userId);
ALTER TABLE public.contacts ADD CONSTRAINT fk_contacts_imported_by FOREIGN KEY (importedBy) REFERENCES public.users(userId);
ALTER TABLE public.stages ADD CONSTRAINT fk_stages_pipeline FOREIGN KEY (pipelineId) REFERENCES public.pipelines(pipelineId) ON DELETE CASCADE;
ALTER TABLE public.deals ADD CONSTRAINT fk_deals_contact FOREIGN KEY (contactId) REFERENCES public.contacts(contactId);
ALTER TABLE public.deals ADD CONSTRAINT fk_deals_owner FOREIGN KEY (ownerId) REFERENCES public.users(userId);
ALTER TABLE public.deals ADD CONSTRAINT fk_deals_stage FOREIGN KEY (stageId) REFERENCES public.stages(stageId);
ALTER TABLE public.deals ADD CONSTRAINT fk_deals_pipeline FOREIGN KEY (pipelineId) REFERENCES public.pipelines(pipelineId);
ALTER TABLE public.dealTags ADD CONSTRAINT fk_deal_tags_deal FOREIGN KEY (dealId) REFERENCES public.deals(dealId) ON DELETE CASCADE;
ALTER TABLE public.dealTags ADD CONSTRAINT fk_deal_tags_tag FOREIGN KEY (tagId) REFERENCES public.tags(tagId) ON DELETE CASCADE;
ALTER TABLE public.expenses ADD CONSTRAINT fk_expenses_category FOREIGN KEY (categoryId) REFERENCES public.expenseCategories(categoryId);
ALTER TABLE public.expenses ADD CONSTRAINT fk_expenses_recorded_by FOREIGN KEY (recordedBy) REFERENCES public.users(userId);
ALTER TABLE public.goals ADD CONSTRAINT fk_goals_target_user FOREIGN KEY (targetUser) REFERENCES public.users(userId);
ALTER TABLE public.goals ADD CONSTRAINT fk_goals_target_team FOREIGN KEY (targetTeam) REFERENCES public.teams(teamId);
ALTER TABLE public.webhooks ADD CONSTRAINT fk_webhooks_pipeline FOREIGN KEY (linkedPipelineId) REFERENCES public.pipelines(pipelineId);

-- Habilitar Row Level Security em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealTags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenseCategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Criar índices para melhor performance
CREATE INDEX idx_stages_pipeline_order ON public.stages(pipelineId, stageOrder);
CREATE INDEX idx_deals_stage ON public.deals(stageId);
CREATE INDEX idx_deals_pipeline ON public.deals(pipelineId);
CREATE INDEX idx_deals_owner ON public.deals(ownerId);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_users_email ON public.users(email);

-- Inserir dados de exemplo
INSERT INTO public.pipelines (pipelineName, pipelineType, isEditable) VALUES
('Funil de Vendas Principal', 'SALES', true),
('Funil de Prospecção', 'PROSPECTING', true),
('Pós-Vendas', 'POST_SALES', true);

-- Inserir stages para o funil de vendas principal
WITH pipeline_sales AS (
    SELECT pipelineId FROM public.pipelines WHERE pipelineName = 'Funil de Vendas Principal'
)
INSERT INTO public.stages (stageName, pipelineId, stageOrder) 
SELECT 
    stage_name,
    pipeline_sales.pipelineId,
    stage_order
FROM pipeline_sales,
(VALUES 
    ('Lead Qualificado', 1),
    ('Reunião Agendada', 2),
    ('Proposta Enviada', 3),
    ('Negociação', 4),
    ('Fechado', 5)
) AS stages(stage_name, stage_order);

-- Inserir stages para o funil de prospecção
WITH pipeline_prospect AS (
    SELECT pipelineId FROM public.pipelines WHERE pipelineName = 'Funil de Prospecção'
)
INSERT INTO public.stages (stageName, pipelineId, stageOrder)
SELECT 
    stage_name,
    pipeline_prospect.pipelineId,
    stage_order
FROM pipeline_prospect,
(VALUES 
    ('Novo Lead', 1),
    ('Primeiro Contato', 2),
    ('Interesse Demonstrado', 3),
    ('Qualificado para Vendas', 4)
) AS stages(stage_name, stage_order);

-- Inserir contatos de exemplo
INSERT INTO public.contacts (firstName, lastName, email, phone, company, isClient) VALUES
('João', 'Silva', 'joao.silva@empresa.com', '(11) 99999-1111', 'Empresa A', false),
('Maria', 'Santos', 'maria.santos@empresab.com', '(11) 99999-2222', 'Empresa B', false),
('Pedro', 'Oliveira', 'pedro.oliveira@empresac.com', '(11) 99999-3333', 'Empresa C', true),
('Ana', 'Costa', 'ana.costa@empresad.com', '(11) 99999-4444', 'Empresa D', false);

-- Inserir deals de exemplo
WITH pipeline_data AS (
    SELECT 
        p.pipelineId,
        s.stageId,
        s.stageName,
        ROW_NUMBER() OVER (PARTITION BY p.pipelineId ORDER BY s.stageOrder) as stage_number
    FROM public.pipelines p
    JOIN public.stages s ON p.pipelineId = s.pipelineId
    WHERE p.pipelineName = 'Funil de Vendas Principal'
),
contact_data AS (
    SELECT contactId, firstName, lastName FROM public.contacts LIMIT 4
)
INSERT INTO public.deals (dealTitle, dealValue, status, contactId, stageId, pipelineId)
SELECT 
    'Oportunidade com ' || c.firstName || ' ' || c.lastName,
    (RANDOM() * 50000 + 10000)::NUMERIC(10,2),
    'OPEN',
    c.contactId,
    pd.stageId,
    pd.pipelineId
FROM contact_data c
CROSS JOIN pipeline_data pd
WHERE pd.stage_number <= 4
ORDER BY RANDOM()
LIMIT 8;