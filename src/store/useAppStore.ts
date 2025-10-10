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

interface AppState {
  tasks: Task[];
}

interface AppActions {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  tasks: [],

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
}));