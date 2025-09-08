import { create } from 'zustand';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  value: number;
  status: string;
  assignedTo: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  assignedTo: string;
  createdAt: Date;
}

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  role: string;
  team?: string;
  performance: number;
  targets: number;
  createdAt: Date;
}

interface AppState {
  leads: Lead[];
  tasks: Task[];
  goals: Goal[];
  salesTeam: SalesPerson[];
}

interface AppActions {
  // Lead actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Sales person actions
  addSalesPerson: (person: Omit<SalesPerson, 'id' | 'createdAt'>) => void;
  updateSalesPerson: (id: string, person: Partial<SalesPerson>) => void;
  deleteSalesPerson: (id: string) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  leads: [],
  tasks: [],
  goals: [],
  salesTeam: [],

  // Lead actions
  addLead: (lead) =>
    set((state) => {
      const newLead: Lead = {
        ...lead,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      toast.success('Lead criado com sucesso!');
      return { leads: [...state.leads, newLead] };
    }),

  updateLead: (id, updatedLead) =>
    set((state) => {
      const leads = state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updatedLead } : lead
      );
      toast.success('Lead atualizado com sucesso!');
      return { leads };
    }),

  deleteLead: (id) =>
    set((state) => {
      const leads = state.leads.filter((lead) => lead.id !== id);
      toast.success('Lead removido com sucesso!');
      return { leads };
    }),

  // Task actions
  addTask: (task) =>
    set((state) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      toast.success('Tarefa criada com sucesso!');
      return { tasks: [...state.tasks, newTask] };
    }),

  updateTask: (id, updatedTask) =>
    set((state) => {
      const tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      );
      toast.success('Tarefa atualizada!');
      return { tasks };
    }),

  deleteTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((task) => task.id !== id);
      toast.success('Tarefa removida!');
      return { tasks };
    }),

  // Goal actions
  addGoal: (goal) =>
    set((state) => {
      const newGoal: Goal = {
        ...goal,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      toast.success('Meta criada com sucesso!');
      return { goals: [...state.goals, newGoal] };
    }),

  updateGoal: (id, updatedGoal) =>
    set((state) => {
      const goals = state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updatedGoal } : goal
      );
      toast.success('Meta atualizada!');
      return { goals };
    }),

  deleteGoal: (id) =>
    set((state) => {
      const goals = state.goals.filter((goal) => goal.id !== id);
      toast.success('Meta removida.');
      return { goals };
    }),

  // Sales person actions
  addSalesPerson: (person) =>
    set((state) => {
      const newPerson: SalesPerson = {
        ...person,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      toast.success('Vendedor adicionado com sucesso!');
      return { salesTeam: [...state.salesTeam, newPerson] };
    }),

  updateSalesPerson: (id, updatedPerson) =>
    set((state) => {
      const salesTeam = state.salesTeam.map((person) =>
        person.id === id ? { ...person, ...updatedPerson } : person
      );
      toast.success('Vendedor atualizado!');
      return { salesTeam };
    }),

  deleteSalesPerson: (id) =>
    set((state) => {
      const salesTeam = state.salesTeam.filter((person) => person.id !== id);
      toast.success('Vendedor removido!');
      return { salesTeam };
    }),
}));