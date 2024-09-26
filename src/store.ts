import { create } from 'zustand';
import { fetchAgents } from './actions/agentActions'; // Assuming you have this server action

interface AgentState {
  agents: any[]; // Replace 'any' with a proper Agent interface if available
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  updateAgent: (updatedAgent: any) => void; // Replace 'any' with proper Agent type
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true });
    try {
      const agents = await fetchAgents();
      set({ agents, isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateAgent: (updatedAgent) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      ),
    }));
  },
}));
