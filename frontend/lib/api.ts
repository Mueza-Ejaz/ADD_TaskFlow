import { getSession } from "next-auth/react"; // Import getSession

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithAuth<T>(url: string, options?: RequestInit): Promise<T> {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
  } as Record<string, string>;

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 specifically for token refresh or redirect to login
    if (response.status === 401) {
        // Here you might trigger a token refresh attempt or redirect to login
        console.error("Authentication failed. Redirecting to login...");
        // Example: router.push('/login'); or trigger signOut()
    }
    throw new Error(`Error fetching ${url}: ${response.statusText} (Status: ${response.status})`);
  }
  return response.json();
}

export const api = {
  get: async <T>(path: string): Promise<T> => {
    return fetchWithAuth<T>(`${API_BASE_URL}${path}`, { method: "GET" });
  },

  post: async <T, U>(path: string, data: U): Promise<T> => {
    return fetchWithAuth<T>(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put: async <T, U>(path: string, data: U): Promise<T> => {
    return fetchWithAuth<T>(`${API_BASE_URL}${path}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch: async <T, U>(path: string, data: U): Promise<T> => {
    return fetchWithAuth<T>(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (path: string): Promise<void> => {
    await fetchWithAuth<void>(`${API_BASE_URL}${path}`, { method: "DELETE" });
  },
};
