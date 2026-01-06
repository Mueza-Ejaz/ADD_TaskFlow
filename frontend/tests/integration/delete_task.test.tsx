import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TaskCard } from '@/components/TaskCard'; // Assuming TaskCard will have a delete button
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'; // Assuming ConfirmationModal exists
import { useDeleteTask } from '@/hooks/useTasks'; // Will mock this

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useDeleteTask hook
const mockUseDeleteTask = jest.fn();
jest.mock('@/hooks/useTasks', () => ({
  useDeleteTask: () => mockUseDeleteTask(),
  // Keep other use...Task hooks as original or mock them if they interfere
  useTasks: jest.fn(() => ({ data: [], isLoading: false, isError: false })),
  useCreateTask: jest.fn(),
  useUpdateTask: jest.fn(),
  useToggleTaskStatus: jest.fn(),
}));

const queryClient = new QueryClient();

describe('Delete Task Flow', () => {
  const mockTask = {
    id: 1,
    title: 'Task to Delete',
    description: 'This task will be deleted.',
    priority: 1,
    due_date: '2025-01-01T10:00:00Z',
    status: 'todo',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockOnEditTask = jest.fn(); // Required by TaskCard

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockOnEditTask.mockClear();
    mockUseDeleteTask.mockClear();
    // Simulate successful deletion
    mockUseDeleteTask.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue(true),
    });
  });

  it('opens confirmation modal and deletes task on confirm', async () => {
    let isModalOpen = false;
    const setIsModalOpen = (isOpen: boolean) => { isModalOpen = isOpen; };
    const handleConfirm = async () => {
      // In a real scenario, this would be triggered by an actual delete mutation
      await mockUseDeleteTask().mutateAsync(mockTask.id);
      setIsModalOpen(false);
    };

    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {/* Simulate a component that would trigger delete and open the modal */}
          <button onClick={() => setIsModalOpen(true)}>Delete Task</button>
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={() => setIsModalOpen(false)}
            title="Delete Task"
            message={`Are you sure you want to delete "${mockTask.title}"?`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </SessionProvider>
      </QueryClientProvider>
    );

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /Delete Task/i }));
    await waitFor(() => expect(screen.getByText('Delete Task')).toBeInTheDocument());

    // Confirm deletion
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(mockUseDeleteTask().mutateAsync).toHaveBeenCalledTimes(1);
      expect(mockUseDeleteTask().mutateAsync).toHaveBeenCalledWith(mockTask.id);
      // Assert that modal closes
      expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
    });
  });

  it('closes confirmation modal without deleting on cancel', async () => {
    let isModalOpen = true; // Assume modal is already open for this test
    const setIsModalOpen = (isOpen: boolean) => { isModalOpen = isOpen; };
    const handleConfirm = jest.fn(); // Should not be called

    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={() => setIsModalOpen(false)}
            title="Delete Task"
            message={`Are you sure you want to delete "${mockTask.title}"?`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </SessionProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Delete Task')).toBeInTheDocument();

    // Cancel deletion
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => {
      expect(handleConfirm).not.toHaveBeenCalled();
      expect(mockUseDeleteTask().mutateAsync).not.toHaveBeenCalled();
      // Assert that modal closes
      expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
    });
  });
});
