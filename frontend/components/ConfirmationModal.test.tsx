import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmationModal } from './ui/ConfirmationModal'; // Assuming this component will be created

describe('ConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmationModal
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
      />
    );

    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        cancelText="Cancel"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
