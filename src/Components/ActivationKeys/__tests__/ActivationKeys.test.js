import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ActivationKeys from '../index';
import Authentication from '../../../Components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUser from '../../../hooks/useUser';
import { def, get } from 'bdd-lazy-var';
import useActivationKeys from '../../../hooks/useActivationKeys';
import '@testing-library/jest-dom';
import { Relation, useHasRelation } from '../../../hooks/useHasRelation';

jest.mock('../../../hooks/useActivationKeys');
jest.mock('../../../hooks/useUser');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));
jest.mock('../../../hooks/useHasRelation');

const queryClient = new QueryClient();

const PageContainer = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>
      <Router>
        <ActivationKeys />
      </Router>
    </Authentication>
  </QueryClientProvider>
);

const mockRelation = (map) => {
  useHasRelation.mockImplementation((r) => ({
    has: map?.[r] || false,
    isLoading: false,
  }));
};

const mockAuthenticateUser = (isLoading, isError) => {
  const user = {
    accountNumber: '123',
    orgId: '123',
  };
  useUser.mockReturnValue({
    isLoading: isLoading,
    isFetching: false,
    isSuccess: true,
    isError: isError,
    data: user,
  });

  if (isError === false) {
    queryClient.setQueryData(['user'], user);
  }
};

// eslint-disable-next-line react/display-name
jest.mock('../../../Components/ActivationKeysTable', () => () => (
  <div>Activation Keys Table</div>
));
jest.mock(
  '@redhat-cloud-services/frontend-components/NotAuthorized',
  // eslint-disable-next-line react/display-name
  () => () => <div>Not Authorized</div>,
);

jest.mock(
  '@redhat-cloud-services/frontend-components/Unavailable',
  // eslint-disable-next-line react/display-name
  () => () => <div>Unavailable</div>,
);

describe('ActivationKeys', () => {
  def('isLoading', () => false);
  def('isError', () => false);
  def('relations', () => {
    return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: true };
  });
  def('keysData', () => [
    {
      name: 'A',
      role: 'B',
      serviceLevel: 'C',
      usage: 'D',
    },
  ]);

  beforeEach(() => {
    jest.resetAllMocks();
    mockRelation(get('relations'));
    mockAuthenticateUser(get('isLoading'), get('isError'));
    useActivationKeys.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      data: get('keysData'),
    });
  });

  it('renders correctly', async () => {
    const { container } = render(<PageContainer />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  describe('when the user call fails', () => {
    def('isError', () => true);

    it('renders an error message when user call fails', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when the user does not have proper permissions', () => {
    def('relations', () => {
      return { [Relation.KEYS_VIEW]: false };
    });

    it('redirects to not authorized page', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when the user have only read permissions', () => {
    def('relations', () => {
      return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: false };
    });

    it('create activation key button is disabled', async () => {
      render(<PageContainer />);
      await waitFor(() =>
        expect(
          screen.getByText('Create activation key').parentElement,
        ).toBeDisabled(),
      );
    });
  });

  describe('show blank state when no activation keys', () => {
    def('keysData', () => []);

    it('renders blank state', async () => {
      render(<PageContainer />);
      expect(screen.getByText('No activation keys')).toBeInTheDocument();
    });
  });
});
