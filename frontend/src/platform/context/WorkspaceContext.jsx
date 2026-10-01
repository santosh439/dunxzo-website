import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../lib/api.js";

const WorkspaceCtx = createContext(null);
export const useWorkspace = () => useContext(WorkspaceCtx);

export function WorkspaceProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const ws = await apiFetch("/workspace");
      setData(ws);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const reviewControl = useCallback(async (id) => {
    const ws = await apiFetch(`/workspace/controls/${encodeURIComponent(id)}/review`, { method: "PATCH" });
    setData(ws);
  }, []);

  const acceptRisk = useCallback(async (id) => {
    const ws = await apiFetch(`/workspace/risks/${encodeURIComponent(id)}/accept`, { method: "PATCH" });
    setData(ws);
  }, []);

  return (
    <WorkspaceCtx.Provider value={{ data, error, refresh, reviewControl, acceptRisk }}>
      {children}
    </WorkspaceCtx.Provider>
  );
}
