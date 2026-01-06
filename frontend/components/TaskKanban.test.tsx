import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskKanban } from './TaskKanban';
import { useTasks } from '@/hooks/useTasks'; // Mock this
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Mock this

// Mock the useTasks hook
jest.mock('@/hooks/useTasks', () => ({
  useTasks: jest.fn(),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient();

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    priority: 1,
    due_date: '2025-01-01T10:00:00Z',
    status: 'todo',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    priority: 2,
    due_date: '2025-01-02T11:00:00Z',
    status: 'in_progress',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 3',
    priority: 3,
    due_date: '2025-01-03T12:00:00Z',
    status: 'done',
    user_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

describe('TaskKanban', () => {
  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    (useTasks as jest.Mock).mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders Kanban columns and tasks correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TaskKanban tasks={mockTasks} onEditTask={mockOnEditTask} />
        </SessionProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('To Do (1)')).toBeInTheDocument();
    expect(screen.getByText('In Progress (1)')).toBeInTheDocument();
    expect(screen.getByText('Done (1)')).toBeInTheDocument();

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  // Placeholder for DND-Kit related tests
  it.todo('handles drag and drop to change task status');
});
