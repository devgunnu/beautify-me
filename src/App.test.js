import { render, screen } from '@testing-library/react';
import App from './App';

describe('LearnLens App', () => {
  test('renders LearnLens hero title', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { name: /LearnLens/i, level: 1 });
    expect(titleElement).toBeInTheDocument();
  });

  test('renders start webcam button', () => {
    render(<App />);
    const buttonElement = screen.getByText(/Start Webcam/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('displays hero section with main tagline', () => {
    render(<App />);
    expect(screen.getByText(/Real-time AI Filters/i)).toBeInTheDocument();
  });

  test('renders primary CTA button', () => {
    render(<App />);
    expect(screen.getByText(/Try It Now/i)).toBeInTheDocument();
  });

  test('renders statistics section', () => {
    render(<App />);
    // Check for unique statistics text
    expect(screen.getByText(/Zero Latency/i)).toBeInTheDocument();
  });

  test('renders How It Works section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /How It Works/i })).toBeInTheDocument();
  });

  test('renders footer with copyright year', () => {
    render(<App />);
    expect(screen.getByText(/© 2025/i)).toBeInTheDocument();
  });
});
