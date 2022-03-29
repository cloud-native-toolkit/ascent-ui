import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Software Everywhere header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Software Everywhere/i);
  expect(linkElement).toBeInTheDocument();
});
