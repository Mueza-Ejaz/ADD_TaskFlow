import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { TaskFormSchema } from '@/components/TaskForm'; // Import the schema from TaskForm
import { getTasksApi, createTaskApi, updateTaskApi, toggleTaskStatusApi, deleteTaskApi, TaskRead, TaskUpdatePayload, TaskStatusUpdatePayload, TaskFilters } from '@/lib/api'; // Import from api.ts
import { useToast } from '@/providers/ToastProvider'; // Import useToast

type TaskCreate = z.infer<typeof TaskFormSchema>;

export const useTasks = (filters: TaskFilters = {}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery<TaskRead[], Error>({
    queryKey: ['tasks', filters], // Include filters in queryKey
    queryFn: () => getTasksApi(accessToken, filters),
    enabled: !!accessToken, // Only run the query if accessToken is available
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();

  interface MutationContext {
    previousTasks: TaskRead[] | undefined;
  }

  return useMutation<TaskRead, Error, TaskCreate, MutationContext>({
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
          user_id: parseInt(session?.user?.id as string) || 0, // Placeholder user ID
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
      showToast(err.message, 'error'); // Show error toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();

  interface MutationContext {
    previousTasks: TaskRead[] | undefined;
  }

  return useMutation<TaskRead, Error, TaskUpdatePayload, MutationContext>({
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
      showToast(err.message, 'error'); // Show error toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();

  interface MutationContext {
    previousTasks: TaskRead[] | undefined;
  }

  return useMutation<TaskRead, Error, TaskStatusUpdatePayload, MutationContext>({
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
      showToast(err.message, 'error'); // Show error toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();

  interface MutationContext {
    previousTasks: TaskRead[] | undefined;
  }

  return useMutation<void, Error, number, MutationContext>({
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
      showToast(err.message, 'error'); // Show error toast
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};