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
      // Always filter tasks by user ID for security
      const effectiveUserId = opts.user_id || userId;
      if (effectiveUserId) {
        query = query.eq("user_id", effectiveUserId);
      } else {
        // If userId is not set, no tasks should be returned
        setTasks([]);
        setLoading(false);
        return { data: [], error: null };
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
      // Only allow task creation for the currently authenticated user
      const actualUserId = user_id || userId;
      if (!actualUserId) {
        setError(new Error("No user ID provided for new task"));
        setLoading(false);
        return { data: null, error: new Error("Not authenticated") };
      }
      const { data, error } = await supabase
        .from(TASKS_TABLE)
        .insert([{ title, description, progress, user_id: actualUserId, date }])
        .select()
        .single();
      if (!error) setTasks((prev) => [data, ...prev]);
      setLoading(false);
      setError(error);
      return { data, error };
    },
    [userId]
  );

  // PUBLIC_INTERFACE
  const updateTask = useCallback(
    async (id, updates) => {
      setLoading(true);
      setError(null);
      // Forbid updating tasks not owned by the current user
      if (!userId) {
        setError(new Error("Not authenticated"));
        setLoading(false);
        return { data: null, error: new Error("Not authenticated") };
      }
      // Remove user_id from updates, task ownership cannot be changed (handled backend or by admin panel only)
      const cleanUpdates = { ...updates };
      if ("user_id" in cleanUpdates) delete cleanUpdates.user_id;
      const { data, error } = await supabase
        .from(TASKS_TABLE)
        .update(cleanUpdates)
        .eq("id", id)
        .eq("user_id", userId) // Only update if task belongs to user
        .select()
        .single();
      if (!error && data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...cleanUpdates } : t))
        );
      }
      setLoading(false);
      setError(error);
      return { data, error };
    },
    [userId]
  );

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      // Ensure only task owner can delete
      if (!userId) {
        setError(new Error("Not authenticated"));
        setLoading(false);
        return { success: false, error: new Error("Not authenticated") };
      }
      const { error } = await supabase
        .from(TASKS_TABLE)
        .delete()
        .eq("id", id)
        .eq("user_id", userId); // Only allow deleting own tasks
      if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
      setLoading(false);
      setError(error);
      return { success: !error, error };
    },
    [userId]
  );

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
