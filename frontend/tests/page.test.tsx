import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; // Adjust import path as per your project structure

describe('Home Page', () => {
  it('renders the project title', () => {
    render(<Home />);
    const heading = screen.getByText(/ADD_TaskFlow-App/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the project phase status', () => {
    render(<Home />);
    const statusText = screen.getByText(/Project Foundation Setup - Phase 1/i);
    expect(statusText).toBeInTheDocument();
  });

  it('renders the backend health check section', () => {
    render(<Home />);
    const healthCheckHeading = screen.getByText(/Backend Health Check/i);
    expect(healthCheckHeading).toBeInTheDocument();
  });
});
