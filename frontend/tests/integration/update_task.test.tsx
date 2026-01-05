import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TaskForm } from '@/components/TaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useSession if necessary, though for form interaction it might not be strictly needed
// unless the form itself has auth-dependent logic. For this test, we'll keep it simple.

const queryClient = new QueryClient();

describe('Update Task Flow', () => {
  const mockOnSubmit = jest.fn();
  const mockTask = {
    id: 1,
    title: 'Existing Task',
    description: 'This is an existing task.',
    priority: 2,
    due_date: '2025-01-01T10:00',
    status: 'todo',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders TaskForm with pre-filled data and allows updates', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskForm onSubmit={mockOnSubmit} defaultValues={mockTask} />
        </SessionProvider>
      </QueryClientProvider>
    );

    // Assert that fields are pre-filled
    expect(screen.getByLabelText(/Title/i)).toHaveValue(mockTask.title);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(mockTask.description);
    expect(screen.getByLabelText(/Priority/i)).toHaveValue(mockTask.priority);
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue(mockTask.due_date);

    // Update some fields
    const updatedTitle = 'Updated Task Title';
    const updatedDescription = 'Updated task description.';
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: updatedTitle } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: updatedDescription } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: updatedTitle,
        description: updatedDescription,
        priority: mockTask.priority,
        due_date: mockTask.due_date,
      });
    });
  });

  it('displays validation errors when trying to submit invalid data in update mode', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskForm onSubmit={mockOnSubmit} defaultValues={mockTask} />
        </SessionProvider>
      </QueryClientProvider>
    );

    // Clear the title to trigger validation error
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: '' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
