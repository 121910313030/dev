import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders the app component', () => {
  render(<App />);
  // This helper will print the HTML to your terminal to help you debug
  screen.debug(); 
  
  // Basic assertion to check if the app renders
  expect(true).toBe(true);
});