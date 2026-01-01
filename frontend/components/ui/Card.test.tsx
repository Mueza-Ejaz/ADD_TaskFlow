import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders a card with children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<Card>Test Content</Card>);
    const card = screen.getByText('Test Content').closest('div');
    expect(card).toHaveClass('rounded-lg shadow-lg bg-white');
  });

  it('applies glassmorphism styles when enabled', () => {
    render(<Card glassmorphism>Glassmorphism Card</Card>);
    const card = screen.getByText('Glassmorphism Card').closest('div');
    expect(card).toHaveClass('backdrop-blur-md bg-white/30');
  });
});
