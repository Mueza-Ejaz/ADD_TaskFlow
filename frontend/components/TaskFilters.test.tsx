import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskFilters } from './TaskFilters'; // Assuming this component will be created

describe('TaskFilters', () => {
  const mockOnFilterChange = jest.fn();
  const defaultFilters = {
    priority: '',
    status: '',
    search: '',
    sortBy: '',
    sortOrder: 'asc',
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders filter controls for priority, status, search, and sort', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search tasks.../i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sort By/i)).toBeInTheDocument();
  });

  it('calls onFilterChange with updated priority when priority filter changes', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const prioritySelect = screen.getByLabelText(/Priority/i);
    fireEvent.change(prioritySelect, { target: { value: '1' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...defaultFilters, priority: '1' });
  });

  it('calls onFilterChange with updated status when status filter changes', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...defaultFilters, status: 'in_progress' });
  });

  it('calls onFilterChange with updated search term when search input changes', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const searchInput = screen.getByPlaceholderText(/Search tasks.../i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...defaultFilters, search: 'test query' });
  });

  it('calls onFilterChange with updated sort by when sort select changes', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const sortBySelect = screen.getByLabelText(/Sort By/i);
    fireEvent.change(sortBySelect, { target: { value: 'due_date' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...defaultFilters, sortBy: 'due_date' });
  });

  it('calls onFilterChange with updated sort order when sort order button is clicked', () => {
    render(<TaskFilters currentFilters={defaultFilters} onFilterChange={mockOnFilterChange} />);
    const sortOrderButton = screen.getByLabelText(/Sort Order/i); // Assuming a button with this aria-label
    fireEvent.click(sortOrderButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...defaultFilters, sortOrder: 'desc' });
  });
});
