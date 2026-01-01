import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render modal content when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // You might add more advanced tests involving asynchronous animation behavior
  // but they often require setup like `jest.useFakeTimers()` or waiting for promises.
});
