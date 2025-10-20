import { create } from 'zustand';

interface AppState {
  // Store vazio - todos os dados agora estão no Supabase
}

interface AppActions {
  // Actions vazias - todas as operações agora usam TanStack Query
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>(() => ({
  // Estado inicial vazio
}));