"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/TaskForm";
import { useTasks } from "@/hooks/useTasks";
import { TaskKanban } from "@/components/TaskKanban";
import { EmptyState } from "@/components/EmptyState"; // Import EmptyState

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tasks, isLoading, isError } = useTasks();

  const handleCreateTask = (values: any) => {
    console.log("Task created:", values);
    // T017 will handle the actual API call
    setIsModalOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {session.user?.name || session.user?.email}!</h1>
        <div className="flex space-x-4">
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm">
            Create New Task
          </Button>
          <Button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm">
            Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Placeholder for TaskFilters component */}
        <section className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Task Filters (Placeholder)</h2>
          <div className="h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
            Filters will go here (T043)
          </div>
        </section>

        {/* Task Display */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Tasks</h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-lg text-gray-700">Loading tasks...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-lg text-red-500">Error loading tasks.</p>
            </div>
          ) : tasks && tasks.length > 0 ? (
            <TaskKanban tasks={tasks} />
          ) : (
            <EmptyState />
          )}
        </section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} />
      </Modal>
    </div>
  );
}


