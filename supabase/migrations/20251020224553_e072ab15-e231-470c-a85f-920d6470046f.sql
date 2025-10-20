-- Create enum for task priority
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- Create tasks table
CREATE TABLE public.tasks (
  taskid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  assignedto UUID NOT NULL,
  duedate DATE,
  priority task_priority NOT NULL DEFAULT 'medium',
  createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can manage their own tasks
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
USING (auth.uid() = assignedto);

CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
WITH CHECK (auth.uid() = assignedto);

CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
USING (auth.uid() = assignedto);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = assignedto);