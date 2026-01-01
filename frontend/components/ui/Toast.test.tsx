import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from './Toast';

// Mock framer-motion's motion component to avoid actual animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers(); // Restore real timers
  });

  it('renders a toast message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies correct background color for success type', () => {
    render(<Toast message="Success!" type="success" />);
    expect(screen.getByText('Success!')).toHaveClass('bg-green-500');
  });

  it('calls onClose after duration', () => {
    const handleClose = jest.fn();
    render(<Toast message="Timed out" duration={1000} onClose={handleClose} />);
    expect(screen.getByText('Timed out')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); // Advance timers by 1 second
    });

    expect(screen.queryByText('Timed out')).not.toBeInTheDocument(); // Expect toast to disappear
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not close automatically if duration is 0', () => {
    const handleClose = jest.fn();
    render(<Toast message="Persistent" duration={0} onClose={handleClose} />);
    expect(screen.getByText('Persistent')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000); // Advance timers by 5 seconds
    });

    expect(screen.getByText('Persistent')).toBeInTheDocument();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('closes when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Toast message="Closable" onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(screen.queryByText('Closable')).not.toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
