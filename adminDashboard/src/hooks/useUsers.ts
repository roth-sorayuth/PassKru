import { useState, useEffect, useCallback } from 'react';
import { userService, SaveUserPayload } from '../services/userService';
import { UserItem } from '../types';

export function useUsers(enabled: boolean = true) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (payload: SaveUserPayload) => {
    const created = await userService.createUser(payload);
    await fetchUsers(); // Refresh list to get relationships/exam names
    return created;
  };

  const updateUser = async (id: number, payload: SaveUserPayload) => {
    const updated = await userService.updateUser(id, payload);
    await fetchUsers();
    return updated;
  };

  const deleteUser = async (id: number) => {
    await userService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.userId !== id));
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
