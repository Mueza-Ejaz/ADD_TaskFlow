// frontend/lib/api.ts
import { z } from 'zod';
import { TaskFormSchema } from '@/components/TaskForm';
import { getAuthToken } from '@/lib/authUtils';

type TaskCreate = z.infer<typeof TaskFormSchema>;

export interface TaskRead {
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
export type TaskUpdatePayload = {
  id: number;
} & Partial<TaskCreate>; // Partial because not all fields need to be updated

// Type for updating task status
export type TaskStatusUpdatePayload = {
  id: number;
  status: string;
  completed?: boolean; // Optional, as status change might imply completion
};

export interface TaskFilters {
  status?: string;
  priority?: string; // Sticking to string as HTML select values are strings
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Helper function to handle API responses and errors
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An API error occurred';
    try {
      const errorData = await response.json();
      if (errorData.detail) {
         errorMessage = typeof errorData.detail === 'object'
            ? JSON.stringify(errorData.detail)
            : errorData.detail;
      } else if (errorData.message) {
         errorMessage = errorData.message;
      } else {
        errorMessage = `API Error: ${response.status} ${response.statusText}`;
      }
    } catch (e) {
      errorMessage = `API Error: ${response.status} ${response.statusText}`;
    }

    // Check if this is an authentication error
    if (response.status === 401) {
      // Clear the token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      // Trigger logout event to redirect user to login
      window.dispatchEvent(new Event('LOGOUT_USER'));
      throw new Error('Session expired. Redirecting to login...');
    }

    throw new Error(errorMessage);
  }
  // For DELETE operations, response.json() might fail if no content
  if (response.status === 204) {
    return {} as T; // Return empty object for no content
  }
  return response.json();
}

// Generic API client
const api = {
  get: async <T>(endpoint: string, accessToken?: string): Promise<T> => {
    const token = accessToken || getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return handleApiResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: any, accessToken?: string): Promise<T> => {
    const token = accessToken || getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: any, accessToken?: string): Promise<T> => {
    const token = accessToken || getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<T>(response);
  },

  patch: async <T>(endpoint: string, data: any, accessToken?: string): Promise<T> => {
    const token = accessToken || getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleApiResponse<T>(response);
  },

  delete: async <T>(endpoint: string, accessToken?: string): Promise<T> => {
    const token = accessToken || getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return handleApiResponse<T>(response);
  }
};

export { api };

// API call function for fetching tasks with filters
export const getTasksApi = async (accessToken: string | undefined, filters: TaskFilters): Promise<TaskRead[]> => {
  const token = accessToken || getAuthToken();
  if (!token) {
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
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleApiResponse<TaskRead[]>(response);
};

// API call function for creating tasks
export const createTaskApi = async (newTask: TaskCreate, accessToken: string | undefined): Promise<TaskRead> => {
  const token = accessToken || getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(newTask),
  });

  return handleApiResponse<TaskRead>(response);
};

// API call function for updating tasks
export const updateTaskApi = async (updatedTask: TaskUpdatePayload, accessToken: string | undefined): Promise<TaskRead> => {
  const token = accessToken || getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const { id, ...dataToUpdate } = updatedTask;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dataToUpdate),
  });

  return handleApiResponse<TaskRead>(response);
};

// API call function for toggling task status
export const toggleTaskStatusApi = async (payload: TaskStatusUpdatePayload, accessToken: string | undefined): Promise<TaskRead> => {
  const token = accessToken || getAuthToken();
  if (!token) {
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
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status, completed }), // Send status and completed
  });

  return handleApiResponse<TaskRead>(response);
};

// API call function for deleting tasks
export const deleteTaskApi = async (taskId: number, accessToken: string | undefined): Promise<void> => {
  const token = accessToken || getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleApiResponse<void>(response);
};