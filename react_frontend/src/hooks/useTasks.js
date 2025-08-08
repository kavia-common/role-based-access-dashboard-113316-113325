import { useState, useEffect, useCallback } from "react";
import supabase from "../config/supabase";

/**
 * Hook for interacting with the "tasks" table (CRUD) in Supabase.
 * Fields: title, description, progress, user_id, date
 */
const TASKS_TABLE = "tasks";

// PUBLIC_INTERFACE
export default function useTasks(userId = null) {
  /**
   * This hook provides CRUD operations for task entities
   * Optionally filters by userId for user-specific tasks.
   */

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  const getTasks = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      let query = supabase.from(TASKS_TABLE).select("*");
      if (opts.user_id || userId) {
        query = query.eq("user_id", opts.user_id || userId);
      }
      if (opts.date) {
        query = query.eq("date", opts.date);
      }
      const { data, error } = await query.order("date", { ascending: false });
      if (error) setError(error);
      setTasks(data || []);
      setLoading(false);
      return { data, error };
    },
    [userId]
  );

  // PUBLIC_INTERFACE
  const createTask = useCallback(
    async ({ title, description, progress, user_id, date }) => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from(TASKS_TABLE)
        .insert([{ title, description, progress, user_id, date }])
        .select()
        .single();
      if (!error) setTasks((prev) => [data, ...prev]);
      setLoading(false);
      setError(error);
      return { data, error };
    },
    []
  );

  // PUBLIC_INTERFACE
  const updateTask = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    // Don't allow user_id changes on update for security
    // except by admin UI (handle at UI or backend)
    const { data, error } = await supabase
      .from(TASKS_TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    }
    setLoading(false);
    setError(error);
    return { data, error };
  }, []);

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from(TASKS_TABLE).delete().eq("id", id);
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
    setLoading(false);
    setError(error);
    return { success: !error, error };
  }, []);

  return {
    tasks,
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
