import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { TaskFormSchema } from '@/components/TaskForm'; // Import the schema from TaskForm

type TaskCreate = z.infer<typeof TaskFormSchema>;

interface TaskRead {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Type for updating a task, including its ID
type TaskUpdatePayload = {
  id: number;
} & Partial<TaskCreate>; // Partial because not all fields need to be updated

// Type for updating task status
type TaskStatusUpdatePayload = {
  id: number;
  status: string;
  completed?: boolean; // Optional, as status change might imply completion
};

interface TaskFilters {
  status?: string;
  priority?: string; // Sticking to string as HTML select values are strings
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API call function for fetching tasks with filters
const getTasksApi = async (accessToken: string | undefined, filters: TaskFilters): Promise<TaskRead[]> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.priority) queryParams.append('priority', filters.priority);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.sortBy) queryParams.append('sort_by', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sort_order', filters.sortOrder);

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch tasks');
  }

  return response.json();
};

// API call function for creating tasks
const createTaskApi = async (newTask: TaskCreate, accessToken: string | undefined): Promise<TaskRead> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create task');
  }

  return response.json();
};

// API call function for updating tasks
const updateTaskApi = async (updatedTask: TaskUpdatePayload, accessToken: string | undefined): Promise<TaskRead> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const { id, ...dataToUpdate } = updatedTask;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update task');
  }

  return response.json();
};

// API call function for toggling task status
const toggleTaskStatusApi = async (payload: TaskStatusUpdatePayload, accessToken: string | undefined): Promise<TaskRead> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const { id, status, completed } = payload;
  let endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`;
  let method = 'PUT'; // Default to PUT for generic status update

  if (status === 'completed' && completed === true) {
    endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}/complete`;
    method = 'PATCH'; // Use PATCH for the specific /complete endpoint
  }

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status, completed }), // Send status and completed
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to toggle task status');
  }

  return response.json();
};

// API call function for deleting tasks
const deleteTaskApi = async (taskId: number, accessToken: string | undefined): Promise<void> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete task');
  }
};

export const useTasks = (filters: TaskFilters = {}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery<TaskRead[], Error>({
    queryKey: ['tasks', filters], // Include filters in queryKey
    queryFn: () => getTasksApi(accessToken, filters),
    enabled: !!accessToken, // Only run the query if accessToken is available
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<TaskRead, Error, TaskCreate>({
    mutationFn: (newTask: TaskCreate) => createTaskApi(newTask, session?.accessToken),
    onMutate: async (newTask: TaskCreate) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<TaskRead[]>(['tasks']);

      // Optimistically update to the new value
      queryClient.setQueryData<TaskRead[]>(['tasks'], (old) => {
        // Create a temporary ID for the new task for optimistic update
        const optimisticTask = { 
          ...newTask, 
          id: Date.now(), // Temporary ID
          status: 'pending', // Default status for optimistic update
          user_id: session?.user?.id || 0, // Placeholder user ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return old ? [...old, optimisticTask] : [optimisticTask];
      });

      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskRead[]>(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<TaskRead, Error, TaskUpdatePayload>({
    mutationFn: (updatedTask: TaskUpdatePayload) => updateTaskApi(updatedTask, session?.accessToken),
    onMutate: async (updatedTask: TaskUpdatePayload) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<TaskRead[]>(['tasks']);

      queryClient.setQueryData<TaskRead[]>(['tasks'], (old) => {
        return old ? old.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)) : [];
      });

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskRead[]>(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<TaskRead, Error, TaskStatusUpdatePayload>({
    mutationFn: (payload: TaskStatusUpdatePayload) => toggleTaskStatusApi(payload, session?.accessToken),
    onMutate: async (newStatus: TaskStatusUpdatePayload) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<TaskRead[]>(['tasks']);

      queryClient.setQueryData<TaskRead[]>(['tasks'], (old) => {
        return old ? old.map((task) => (task.id === newStatus.id ? { ...task, status: newStatus.status, completed: newStatus.completed } : task)) : [];
      });

      return { previousTasks };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskRead[]>(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<void, Error, number>({
    mutationFn: (taskId: number) => deleteTaskApi(taskId, session?.accessToken),
    onMutate: async (taskId: number) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<TaskRead[]>(['tasks']);

      queryClient.setQueryData<TaskRead[]>(['tasks'], (old) => {
        return old ? old.filter((task) => task.id !== taskId) : [];
      });

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskRead[]>(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};