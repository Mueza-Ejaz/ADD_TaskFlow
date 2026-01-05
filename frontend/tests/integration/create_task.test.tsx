import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TaskForm } from '../../components/TaskForm'; // Assuming TaskForm is accessible
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // For React Query context
import { jest } from '@jest/globals'; // For jest.mock


// Mock the TaskForm component to isolate testing of the integration flow
// jest.mock('../../components/TaskForm', () => ({
//   TaskForm: jest.fn(({ onSubmit, defaultValues }) => {
//     const [title, setTitle] = useState(defaultValues?.title || '');
//     const [description, setDescription] = useState(defaultValues?.description || '');
//     const [priority, setPriority] = useState(defaultValues?.priority?.toString() || '');
//     const [dueDate, setDueDate] = useState(defaultValues?.due_date || '');

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       onSubmit({
//         title,
//         description: description || undefined,
//         priority: priority ? Number(priority) : undefined,
//         due_date: dueDate || undefined,
//       });
//     };

//     return (
//       <form onSubmit={handleSubmit} data-testid="mock-task-form">
//         <label htmlFor="title">Title</label>
//         <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
//         <label htmlFor="description">Description</label>
//         <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
//         <label htmlFor="priority">Priority</label>
//         <input id="priority" type="number" value={priority} onChange={(e) => setPriority(e.target.value)} />
//         <label htmlFor="due_date">Due Date</label>
//         <input id="due_date" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
//         <button type="submit">Submit</button>
//       </form>
//     );
//   }),
// }));

// Mock the useTasks hook for now, as it's part of T017
const mockUseTasks = jest.fn(() => ({
  createTask: jest.fn(() => Promise.resolve()), // Mock createTask to resolve immediately
  isLoading: false,
  isError: false,
}));

jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}));

const queryClient = new QueryClient();

// A wrapper component to simulate a page that uses TaskForm and potentially a modal
const TestCreateTaskPage = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Create Task Page</h1>
        <TaskForm onSubmit={onSubmit} />
      </div>
    </QueryClientProvider>
  );
};


describe('Create Task Flow Integration', () => {
  const mockFormSubmit = jest.fn();

  beforeEach(() => {
    mockFormSubmit.mockClear();
    // Reset the mock useTasks before each test
    mockUseTasks.mockClear();
    mockUseTasks.mockReturnValue({
      createTask: jest.fn(() => Promise.resolve()),
      isLoading: false,
      isError: false,
    });
  });

  it('submits the form and calls the onSubmit handler with task data', async () => {
    render(<TestCreateTaskPage onSubmit={mockFormSubmit} />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const priorityInput = screen.getByLabelText(/Priority/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await user.type(titleInput, 'Integration Test Task');
    await user.type(descriptionInput, 'This is a description for the integration test task.');
    await user.type(priorityInput, '2');
    await user.type(dueDateInput, '2026-01-15T10:00'); // Example date format

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormSubmit).toHaveBeenCalledTimes(1);
      expect(mockFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Integration Test Task',
          description: 'This is a description for the integration test task.',
          priority: 2,
          due_date: '2026-01-15T10:00',
        })
      );
    });

    // Verify that the createTask mutation (from useTasks hook) would have been called
    // This assumes the onSubmit handler in the actual page/modal calls the createTask hook
    // const { createTask } = mockUseTasks();
    // expect(createTask).toHaveBeenCalledWith(expect.objectContaining({
    //   title: 'Integration Test Task',
    // }));
  });

  it('shows validation errors for invalid input and does not submit', async () => {
    render(<TestCreateTaskPage onSubmit={mockFormSubmit} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await user.click(submitButton); // Try to submit with empty fields

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
    expect(mockFormSubmit).not.toHaveBeenCalled();
  });
});
