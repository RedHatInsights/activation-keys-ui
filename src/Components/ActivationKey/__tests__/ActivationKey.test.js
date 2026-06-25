import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ActivationKey from '../index';
import Authentication from '../../../Components/Authentication';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { def, get } from 'bdd-lazy-var/global';
import useActivationKey from '../../../hooks/useActivationKey';
import '@testing-library/jest-dom';
import useAvailableRepositories from '../../../hooks/useAvailableRepositories';
import { Relation, useHasRelation } from '../../../hooks/useHasRelation';
import useUser from '../../../hooks/useUser';

jest.mock('../../../hooks/useAvailableRepositories');
jest.mock('../../../hooks/useActivationKey');
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
        <ActivationKey />
      </Router>
    </Authentication>
  </QueryClientProvider>
);

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

const mockRelation = (map) => {
  useHasRelation.mockImplementation((r) => ({
    has: map?.[r] || false,
    isLoading: false,
  }));
};

// eslint-disable-next-line react/display-name
jest.mock('../../../Components/AdditionalRepositoriesTable', () => () => (
  <div>Additional Repositories Table</div>
));
// eslint-disable-next-line react/display-name
jest.mock('../../../Components/shared/breadcrumbs', () => () => (
  <div>Breadcrumbs</div>
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

describe('ActivationKey', () => {
  def('relations', () => {
    return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: true };
  });
  def('keyData', () => {
    return {
      name: 'A',
      role: 'B',
      serviceLevel: 'C',
      usage: 'D',
      additionalRepositories: [],
      releaseVersion: 1,
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthenticateUser(
      get('isLoading'),
      get('isError'),
      get('rbacPermissions'),
    );
    mockRelation(get('relations'));
    useActivationKey.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      data: get('keyData'),
    });
  });

  it('renders correctly', async () => {
    useAvailableRepositories.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      data: [], // Mock the data that the hook returns
    });

    render(
      <QueryClientProvider client={queryClient}>
        <PageContainer />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('System Purpose')).toBeInTheDocument(),
    );
    expect(screen.getByText('Workload')).toBeInTheDocument();
    expect(screen.getByText('Additional repositories')).toBeInTheDocument();
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
      return { [Relation.KEYS_VIEW]: false, [Relation.KEYS_EDIT]: false };
    });

    it('redirects to not authorized page', async () => {
      render(<PageContainer />);
      await waitFor(() =>
        expect(screen.getByText('Not Authorized')).toBeInTheDocument(),
      );
    });
  });
});
