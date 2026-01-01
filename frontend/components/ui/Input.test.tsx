import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input field', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders an error message when provided', () => {
    render(<Input error="Invalid input" />);
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
