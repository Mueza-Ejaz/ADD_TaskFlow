"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import components
const DynamicModal = dynamic(() => import("@/components/ui/Modal").then((mod) => mod.Modal), {
  loading: () => <p className="hidden">Loading modal...</p>,
  ssr: false,
});
const DynamicConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal").then((mod) => mod.ConfirmationModal), {
  loading: () => <p className="hidden">Loading confirmation...</p>,
  ssr: false,
});
const DynamicTaskForm = dynamic(() => import("@/components/TaskForm").then((mod) => mod.TaskForm), {
  loading: () => <p className="hidden">Loading form...</p>,
  ssr: false,
});

import { Button } from "@/components/ui/Button";
import { TaskRead } from "@/lib/api";

import { useCreateTask, useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);

  const { data: tasks, isLoading, isError } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = async (values: any) => {
    await createTaskMutation.mutateAsync(values);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (values: any) => {
    if (editingTask) {
      await updateTaskMutation.mutateAsync({ id: editingTask.id, ...values });
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async () => {
    if (taskIdToDelete !== null) {
      await deleteTaskMutation.mutateAsync(taskIdToDelete);
      setShowConfirmDeleteModal(false);
      setTaskIdToDelete(null);
    }
  };

  const openEditModal = (task: TaskRead) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openConfirmDeleteModal = (taskId: number) => {
    setTaskIdToDelete(taskId);
    setShowConfirmDeleteModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const closeConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
    setTaskIdToDelete(null);
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
          <Button
            onClick={() => {
              console.log("Create New Task button clicked");
              setEditingTask(null);
              setIsModalOpen(true);
              console.log("Modal state after update:", { isModalOpen: true, editingTask: null });
            }}
            variant="primary"
          >
            Create New Task
          </Button>
          <Button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-red-600 hover:bg-red-700 text-white">
            Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Placeholder for new CRUD UI */}
        <section className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Management</h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-lg text-gray-700">Loading tasks...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center min-h-96">
              <p className="text-lg text-red-500 mb-4">Error loading tasks.</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Retry
              </Button>
            </div>
          ) : (
            tasks && tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{task.description || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button onClick={() => openEditModal(task)} variant="secondary" className="mr-2">
                            Edit
                          </Button>
                          <Button onClick={() => openConfirmDeleteModal(task.id)} variant="destructive">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-96">
                <p className="text-lg text-gray-700 mb-4">No tasks found. Create one to get started!</p>
                <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} variant="primary">
                  Create New Task
                </Button>
              </div>
            )
          )}
        </section>
      </main>

      <DynamicModal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? "Edit Task" : "Create New Task"} className="z-[9999]">
        <DynamicTaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          defaultValues={editingTask || undefined}
        />
      </DynamicModal>

      <Suspense fallback={<div className="hidden"></div>}>
        <DynamicConfirmationModal
          isOpen={showConfirmDeleteModal}
          onCancel={closeConfirmDeleteModal}
          onConfirm={handleDeleteTask}
          title="Confirm Delete"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          isConfirming={deleteTaskMutation.isPending}
        />
      </Suspense>
    </div>
  );
}


