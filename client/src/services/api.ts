import axios from "axios";
import type { Alert, ApiResponse } from "../types";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const alertsApi = {
  getAll: async (): Promise<Alert[]> => {
    const res = await api.get<ApiResponse<Alert[]>>("/alerts");
    return res.data.data;
  },

  getById: async (id: string): Promise<Alert> => {
    const res = await api.get<ApiResponse<Alert>>(`/alerts/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, status: Alert["status"]): Promise<Alert> => {
    const res = await api.patch<ApiResponse<Alert>>(`/alerts/${id}/status`, { status });
    return res.data.data;
  },

  generateSuggestion: async (id: string): Promise<Alert> => {
    const res = await api.post<ApiResponse<Alert>>(`/alerts/${id}/suggestion`);
    return res.data.data;
  },
};