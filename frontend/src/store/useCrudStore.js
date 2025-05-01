import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const useCrudStore = create((set, get) => ({
  clients: [],
  client: null,
  clientId: null,
  isLoading: false,

  getClients: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/clients`);
      const { clients, message } = response.data;
      set({ clients });
      toast.success(message);
    } catch (error) {
      console.error("Error fetching clients:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch clients";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/client`, { clientData });
      const { client, message } = response.data;
      
      if (client) {
        const allClients = get().clients;
        set({ clients: [...allClients, client] });
        toast.success(message || "Client created successfully");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create client";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  getClient: async (clientId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/client/${clientId}`);
      const { client, message } = response.data;
      
      if (client) {
        set({ client, clientId });
        toast.success(message || "Client retrieved successfully");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch client details";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (clientData, clientId) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        `${API_URL}/client/${clientId}`,
        clientData
      );
      const { client: updatedClient, message } = response.data;
      
      if (updatedClient) {
        // Update the clients array with the updated client
        const updatedClients = get().clients.map(client => 
          client.id === clientId ? updatedClient : client
        );
        
        set({ 
          clients: updatedClients,
          client: updatedClient // Also update the selected client
        });
        
        toast.success(message || "Client updated successfully");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update client";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (clientId) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(`${API_URL}/client/${clientId}`);
      const { message } = response.data;
      
      const filteredClients = get().clients.filter(
        client => client.id !== clientId
      );
      
      set({ 
        clients: filteredClients,
        // Reset client if the deleted one was selected
        client: get().clientId === clientId ? null : get().client,
        clientId: get().clientId === clientId ? null : get().clientId
      });
      
      toast.success(message || "Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete client";
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  
  setClientId: (clientId) => {
    set({ clientId });
  },
  
  clearSelectedClient: () => {
    set({ client: null, clientId: null });
  },
}));