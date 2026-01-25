import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileSearchButton from './MobileSearchButton';

describe('MobileSearchButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering (AC: #1, #2)', () => {
    it('renders search icon button', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      expect(button).toBeInTheDocument();
    });

    it('displays search icon emoji', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const icon = screen.getByText('🔍');
      expect(icon).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      expect(button).toBeInTheDocument();
    });

    it('has button type attribute', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Click handling (AC: #3)', () => {
    it('calls onClick when button is clicked', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times when clicked multiple times', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Touch target size (AC: #2)', () => {
    it('button is rendered and accessible', () => {
      render(<MobileSearchButton onClick={mockOnClick} />);
      const button = screen.getByLabelText('Открыть поиск');
      
      // Verify button exists and is accessible
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
      
      // CSS min-width and min-height are defined in CSS module
      // In jsdom environment, computed styles may not reflect CSS modules
      // The actual size will be verified in browser testing
    });
  });
});
