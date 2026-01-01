import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

// Mock framer-motion's motion component to avoid actual animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('LoadingSpinner', () => {
  it('renders a spinner', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('progressbar'); // Assuming ARIA role for accessibility
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8 w-8 border-4'); // Default size
  });

  it('applies custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveClass('h-12 w-12 border-4');
  });

  it('applies custom color', () => {
    render(<LoadingSpinner color="text-red-500" />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveClass('text-red-500');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveClass('custom-spinner');
  });
});
