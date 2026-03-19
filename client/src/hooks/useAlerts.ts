import { useState, useEffect, useCallback } from "react";
import type { Alert } from "../types";
import { alertsApi } from "../services/api";

type UseAlertsReturn = {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  updateAlert: (updated: Alert) => void;
  addAlert: (alert: Alert) => void;
  refetch: () => Promise<void>;
};

export const useAlerts = (): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await alertsApi.getAll();
      setAlerts(data);
    } catch (err) {
      setError("Failed to fetch alerts. Is the server running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const updateAlert = useCallback((updated: Alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  return {
    alerts,
    isLoading,
    error,
    updateAlert,
    addAlert,
    refetch: fetchAlerts,
  };
};