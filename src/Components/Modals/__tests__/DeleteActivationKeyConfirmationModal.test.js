import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import DeleteActivationKeyConfirmationModal from '../DeleteActivationKeyConfirmationModal';
import '@testing-library/jest-dom';
const queryClient = new QueryClient();

describe('Delete Activation Key Confirmation Modal', () => {
  const activationKeyName = 'Test Modal';
  it('renders correctly', () => {
    const props = {
      handleModalToggle: jest.fn(),
      isOpen: true,
      name: activationKeyName,
    };
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteActivationKeyConfirmationModal {...props} />
      </QueryClientProvider>,
    );
    expect(screen.getByText(activationKeyName)).toBeInTheDocument();
    expect(screen.getByText('Delete activation key?')).toBeInTheDocument();
  });
});
