"use client"; // This component will use client-side features like useEffect, useState, and fetching

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api'; // Import the API client

interface HealthStatus {
  status: string;
  version: string;
}

export default function Home() {
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.get<HealthStatus>("/api/v1/health");
        setBackendHealth(data);
      } catch (err) {
        setError("Failed to fetch backend health.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">ADD_TaskFlow-App</h1>
      <p className="text-xl">Project Foundation Setup - Phase 1</p>
      <p className="text-lg mt-2">Status: Initial setup complete. Ready for development.</p>

      <div className="mt-8 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Backend Health Check</h2>
        {loading && <p>Loading backend health...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {backendHealth && (
          <div>
            <p>Status: <span className={backendHealth.status === "healthy" ? "text-green-500" : "text-red-500"}>{backendHealth.status}</span></p>
            <p>Version: {backendHealth.version}</p>
          </div>
        )}
      </div>
    </div>
  );
}
