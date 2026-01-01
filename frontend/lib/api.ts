// This is a skeleton for the API client.
// It will be expanded in later phases to interact with the FastAPI backend.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  post: async <T, U>(path: string, data: U): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error posting to ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  // Add more methods (put, patch, delete) as needed in future phases
};
