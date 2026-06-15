import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAdditionalRepositoriesModal from '../AddAdditionalRepositoriesModal';
const queryClient = new QueryClient();

describe('Add Additional Repositories Modal', () => {
  it('renders correctly', () => {
    const props = {
      handleModalToggle: jest.fn(),
      isOpen: true,
      repositories: [],
    };
    render(
      <QueryClientProvider client={queryClient}>
        <AddAdditionalRepositoriesModal {...props} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Add repositories')).toBeInTheDocument();
    expect(screen.getByText('Add repositories')).toBeInTheDocument();
  });
});
