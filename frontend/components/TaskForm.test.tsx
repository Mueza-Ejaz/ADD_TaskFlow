import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TaskForm } from './TaskForm'; // Corrected path

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders correctly with all fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('displays validation errors for missing title', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Task Title' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Task description' } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: '3' } });

    const form = screen.getByRole('form'); // Assuming the form has role='form'
    fireEvent.submit(form); // Directly submit the form

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task Title',
        description: 'Task description',
        priority: 3,
        due_date: '',
      });
    });
  });

  it('calls onSubmit with correct data including due_date when form is valid', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Task with Due Date' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: '2025-12-31T23:59' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Task with Due Date',
        description: undefined, // Description is optional, so it might be undefined if not entered
        priority: undefined,    // Priority is optional, so it might be undefined if not entered
        due_date: '2025-12-31T23:59',
      });
    });
  });

  it('pre-fills form with defaultValues', () => {
    const defaultValues = {
      title: 'Default Task',
      description: 'Default description',
      priority: 2,
      due_date: '2025-01-01T12:00',
    };
    render(<TaskForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/Title/i)).toHaveValue('Default Task');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Default description');
    expect(screen.getByLabelText(/Priority/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue('2025-01-01T12:00');
  });
});
