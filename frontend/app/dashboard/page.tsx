"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

// Dynamically import components
const DynamicModal = dynamic(() => import("@/components/ui/Modal").then((mod) => mod.Modal), {
  loading: () => <p className="hidden">Loading...</p>,
  ssr: false,
});
const DynamicConfirmationModal = dynamic(() => import("@/components/ui/ConfirmationModal").then((mod) => mod.ConfirmationModal), {
  loading: () => <p className="hidden">Loading...</p>,
  ssr: false,
});
const DynamicTaskForm = dynamic(() => import("@/components/TaskForm").then((mod) => mod.TaskForm), {
  loading: () => <p className="hidden">Loading...</p>,
  ssr: false,
});

import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { TaskKanban } from "@/components/TaskKanban";
import { TaskFilters as TaskFiltersComponent } from "@/components/TaskFilters";
import { Button } from "@/components/ui/Button";
import { TaskRead, TaskFilters } from "@/lib/api";
import { useCreateTask, useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    priority: "",
    status: "",
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });

  const { data: tasks, isLoading, isError } = useTasks(filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Board</h2>
          <p className="text-sm text-gray-400">Manage your tasks projects</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          className="hidden sm:flex gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="mb-6">
        <TaskFiltersComponent 
          currentFilters={filters as any} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      <div className="h-[calc(100vh-18rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-red-400 mb-4">Error loading tasks.</p>
            <Button onClick={() => window.location.reload()} variant="secondary">
              Retry
            </Button>
          </div>
        ) : (
          <TaskKanban
            initialTasks={tasks || []}
            onEditTask={openEditModal}
            onDeleteTask={openConfirmDeleteModal}
          />
        )}
      </div>

      <FloatingActionButton 
        onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        className="sm:hidden"
      />

      <DynamicModal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? "Edit Task" : "Create New Task"}>
        <DynamicTaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeModal}
          defaultValues={editingTask || undefined}
          isSubmitting={editingTask ? updateTaskMutation.isPending : createTaskMutation.isPending}
        />
      </DynamicModal>

      <Suspense fallback={<div className="hidden"></div>}>
        <DynamicConfirmationModal
          isOpen={showConfirmDeleteModal}
          onCancel={closeConfirmDeleteModal}
          onConfirm={handleDeleteTask}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          isConfirming={deleteTaskMutation.isPending}
        />
      </Suspense>
    </>
  );
}
