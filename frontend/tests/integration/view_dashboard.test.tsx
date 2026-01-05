import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../../app/dashboard/page'; // Assuming this is the correct path to your dashboard page
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    isFallback: false,
  }),
}));

// Mock useSession
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock useTasks hook
jest.mock('../../hooks/useTasks', () => ({
  useTasks: jest.fn(() => ({
    tasks: [], // Initially no tasks
    isLoading: false,
    isError: false,
  })),
}));

const queryClient = new QueryClient();

function setupMockSession(sessionData: any, status: 'authenticated' | 'unauthenticated' | 'loading') {
  (useSession as jest.Mock).mockReturnValue({
    data: sessionData,
    status: status,
  });
}

describe('Dashboard Page Integration - View Tasks', () => {
  it('shows loading state when session is loading', () => {
    setupMockSession(null, 'loading');
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Loading dashboard.../i)).toBeInTheDocument();
  });

  it('redirects to login if not authenticated', () => {
    setupMockSession(null, 'unauthenticated');
    const { useRouter } = jest.requireMock('next/navigation');
    const mockPush = useRouter().push;
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders dashboard for authenticated user', async () => {
    setupMockSession({ user: { name: 'Test User', email: 'test@example.com', id: '123' } }, 'authenticated');
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Welcome to your Dashboard, Test User!/i)).toBeInTheDocument();
      expect(screen.getByText(/Email: test@example.com/i)).toBeInTheDocument();
    });
  });

  // This test will be enhanced once task display components are implemented (T023, T025)
  it('displays a placeholder for tasks when authenticated', async () => {
    setupMockSession({ user: { name: 'Test User', email: 'test@example.com', id: '123' } }, 'authenticated');
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Welcome to your Dashboard, Test User!/i)).toBeInTheDocument();
      // For now, we'll just check for a general section or button related to tasks.
      // This will be replaced with actual task list checks later.
      expect(screen.getByRole('button', { name: /Create New Task/i })).toBeInTheDocument();
    });
  });
});
