import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Home from '../pages/index';

describe('Home page', () => {
  test('renders loading state while fetching data', () => {
    render(<Home />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
