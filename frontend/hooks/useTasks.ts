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

// API call function for fetching tasks
const getTasksApi = async (accessToken: string | undefined): Promise<TaskRead[]> => {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/`, {
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

export const useTasks = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery<TaskRead[], Error>({
    queryKey: ['tasks'],
    queryFn: () => getTasksApi(accessToken),
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