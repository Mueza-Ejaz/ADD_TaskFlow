import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  const defaultProps = {
    id: 1,
    title: 'Test Task',
    status: 'pending',
  };

  it('renders title and status correctly', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/Status: pending/i)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<TaskCard {...defaultProps} description="This is a test description" />);
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument();
  });

  it('renders priority when provided', () => {
    render(<TaskCard {...defaultProps} priority={3} />);
    expect(screen.getByText(/Priority: 3/i)).toBeInTheDocument();
  });

  it('does not render priority when not provided', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.queryByText(/Priority:/i)).not.toBeInTheDocument();
  });

  it('renders due date when provided and formats it correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const isoDate = futureDate.toISOString();
    render(<TaskCard {...defaultProps} due_date={isoDate} />);
    expect(screen.getByText(`Due Date: ${futureDate.toLocaleDateString()}`)).toBeInTheDocument();
  });

  it('does not render due date when not provided', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.queryByText(/Due Date:/i)).not.toBeInTheDocument();
  });

  it('renders with all props provided', () => {
    const allProps = {
      id: 2,
      title: 'Full Featured Task',
      description: 'A task with all optional details.',
      priority: 5,
      due_date: '2026-03-15T10:30:00.000Z',
      status: 'completed',
    };
    render(<TaskCard {...allProps} />);
    expect(screen.getByText('Full Featured Task')).toBeInTheDocument();
    expect(screen.getByText('A task with all optional details.')).toBeInTheDocument();
    expect(screen.getByText(/Status: completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority: 5/i)).toBeInTheDocument();
    expect(screen.getByText(`Due Date: ${new Date(allProps.due_date).toLocaleDateString()}`)).toBeInTheDocument();
  });
});
