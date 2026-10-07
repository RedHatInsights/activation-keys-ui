import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAdditionalRepositoriesModal, {
  type AddAdditionalRepositoriesModalProps
} from '../AddAdditionalRepositoriesModal';
const queryClient = new QueryClient();

describe('Add Additional Repositories Modal', () => {
  it('renders correctly', () => {
    // NOTE: the component requires `keyName` and ignores `repositories`; the
    // props below are preserved verbatim from the original JS test.
    const props = {
      handleModalToggle: jest.fn(),
      isOpen: true,
      repositories: []
    } as unknown as AddAdditionalRepositoriesModalProps;
    render(
      <QueryClientProvider client={queryClient}>
        <AddAdditionalRepositoriesModal {...props} />
      </QueryClientProvider>
    );
    expect(screen.getByText('Add repositories')).toBeInTheDocument();
    expect(screen.getByText('Add repositories')).toBeInTheDocument();
  });
});
