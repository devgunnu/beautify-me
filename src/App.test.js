import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Beautify Me hero title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /Beautify Me/i, level: 1 });
  expect(titleElement).toBeInTheDocument();
});

test('renders start webcam button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Start Webcam/i);
  expect(buttonElement).toBeInTheDocument();
});
