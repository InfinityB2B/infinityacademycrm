import { create } from 'zustand';
import { toast } from 'sonner';

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
  goalid: string;
  targetuser?: string;
  targetteam?: string;
  metric: 'REVENUE' | 'DEALS_WON' | 'APPOINTMENTS_SCHEDULED';
  targetvalue: number;
  startdate: string;
  enddate: string;
  createdat: Date;
}

interface AppState {
  tasks: Task[];
  goals: Goal[];
}

interface AppActions {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'goalid' | 'createdat'>) => void;
  updateGoal: (goalid: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalid: string) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  tasks: [],
  goals: [],

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
  addGoal: (goalData) => {
    const newGoal: Goal = {
      ...goalData,
      goalid: crypto.randomUUID(),
      createdat: new Date(),
    };
    set((state) => ({
      goals: [...state.goals, newGoal],
    }));
    toast.success('Meta criada com sucesso!');
  },

  updateGoal: (goalid, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.goalid === goalid ? { ...goal, ...updates } : goal
      ),
    }));
    toast.success('Meta atualizada!');
  },

  deleteGoal: (goalid) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.goalid !== goalid),
    }));
    toast.success('Meta removida.');
  },
}));