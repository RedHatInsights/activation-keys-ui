import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditActivationKeyWizard from '../EditActivationKeyWizard';

const queryClient = new QueryClient();
const mockHandleModalToggle = jest.fn();
const mockUpdateActivationKey = jest.fn();
const mockAddSuccessNotification = jest.fn();
const mockAddErrorNotification = jest.fn();

jest.mock('../../../hooks/useUpdateActivationKey', () => () => ({
  mutate: mockUpdateActivationKey,
  isLoading: false,
}));
jest.mock('../../../hooks/useSystemPurposeAttributes', () => () => ({
  isLoading: false,
  error: null,
  data: {},
}));
jest.mock('../../../hooks/useNotifications', () => () => ({
  addSuccessNotification: mockAddSuccessNotification,
  addErrorNotification: mockAddErrorNotification,
}));
describe('EditActivationKeyWizard', () => {
  const defaultProps = {
    activationKey: {
      name: 'Test Key',
      description: 'Existing description',
      role: 'Test Role',
      serviceLevel: 'Premium',
      usage: 'Test Usage',
      releaseVersion: '1.0',
    },
    releaseVersions: ['1.0', '2.0'],
    handleModalToggle: mockHandleModalToggle,
    isOpen: true,
  };
  const renderComponent = (props = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <EditActivationKeyWizard {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  it('renders the wizard with initial step', () => {
    renderComponent();
    expect(screen.getByText(/edit activation key/i)).toBeInTheDocument();
    expect(screen.getByText(/Name key/i)).toBeInTheDocument();
  });
  it('updates the description field and validates it', async () => {
    renderComponent();
    const descriptionInput = screen.getByDisplayValue('Existing description');
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' },
    });
    expect(descriptionInput.value).toBe('New Description');
  });
  it('navigates through the wizard steps', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByText(/Edit Workload/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByText(/Edit system purpose/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/next/i));
    expect(
      screen.getByRole('heading', { name: /Review/i })
    ).toBeInTheDocument();
  });
  it('displays confirmation modal when closing in the middle of the wizard', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/next/i));
    fireEvent.click(screen.getByLabelText(/close/i));
    expect(
      screen.getByText(/exit activation key creation\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all inputs will be discarded/i)
    ).toBeInTheDocument();
  });
  it('calls handleModalToggle when confirmed close', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/next/i));
    fireEvent.click(screen.getByLabelText(/close/i));
    fireEvent.click(screen.getByRole('button', { name: /exit/i }));
    await waitFor(() => expect(mockHandleModalToggle).toHaveBeenCalled());
  });
});
