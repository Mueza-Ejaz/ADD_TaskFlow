import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TaskFilters } from '@/components/TaskFilters'; // Assuming TaskFilters component
import { useTasks } from '@/hooks/useTasks'; // Mock useTasks

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useTasks to control its return values for testing filter/sort/search
const mockUseTasks = jest.fn();
jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
  useCreateTask: jest.fn(),
  useUpdateTask: jest.fn(),
  useToggleTaskStatus: jest.fn(),
}));

const queryClient = new QueryClient();

describe('Filter, Sort, Search Functionality', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockOnFilterChange.mockClear();
    // Default mock for useTasks, returning empty data for filter tests
    mockUseTasks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  it('filters tasks by priority', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskFilters currentFilters={{ priority: '', status: '', search: '', sortBy: '', sortOrder: 'asc' }} onFilterChange={mockOnFilterChange} />
        </SessionProvider>
      </QueryClientProvider>
    );

    const prioritySelect = screen.getByLabelText(/Priority/i);
    fireEvent.change(prioritySelect, { target: { value: '1' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ priority: '1' }));
    });
  });

  it('filters tasks by status', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskFilters currentFilters={{ priority: '', status: '', search: '', sortBy: '', sortOrder: 'asc' }} onFilterChange={mockOnFilterChange} />
        </SessionProvider>
      </QueryClientProvider>
    );

    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'in_progress' }));
    });
  });

  it('searches tasks by text input', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskFilters currentFilters={{ priority: '', status: '', search: '', sortBy: '', sortOrder: 'asc' }} onFilterChange={mockOnFilterChange} />
        </SessionProvider>
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search tasks.../i);
    fireEvent.change(searchInput, { target: { value: 'urgent' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'urgent' }));
    });
  });

  it('sorts tasks by due date in ascending order', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskFilters currentFilters={{ priority: '', status: '', search: '', sortBy: '', sortOrder: 'asc' }} onFilterChange={mockOnFilterChange} />
        </SessionProvider>
      </QueryClientProvider>
    );

    const sortBySelect = screen.getByLabelText(/Sort By/i);
    fireEvent.change(sortBySelect, { target: { value: 'due_date' } });

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'due_date', sortOrder: 'asc' }));
    });
  });

  it('sorts tasks by priority in descending order', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskFilters currentFilters={{ priority: '', status: '', search: '', sortBy: 'priority', sortOrder: 'asc' }} onFilterChange={mockOnFilterChange} />
        </SessionProvider>
      </QueryClientProvider>
    );

    const sortOrderButton = screen.getByLabelText(/Sort Order/i);
    fireEvent.click(sortOrderButton); // Toggle to 'desc'

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'priority', sortOrder: 'desc' }));
    });
  });
});
