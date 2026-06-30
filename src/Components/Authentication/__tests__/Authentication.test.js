import React from 'react';
import { render, waitFor } from '@testing-library/react';
import useUser from '../../../hooks/useUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { def, get } from 'bdd-lazy-var';
import Authentication from '../Authentication';
import { Relation, useHasRelation } from '../../../hooks/useHasRelation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}));
jest.mock('../../../hooks/useUser');
jest.mock('../../../hooks/useHasRelation');

const queryClient = new QueryClient();

const mockAuthenticateUser = (isLoading = true, isError = false) => {
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

const PageContainer = () => (
  <QueryClientProvider client={queryClient}>
    <Authentication>Authentication Test Content</Authentication>
  </QueryClientProvider>
);

describe('Authentication', () => {
  def('isLoading', () => false);
  def('isError', () => false);
  def('relations', () => {
    return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: true };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthenticateUser(
      get('isLoading'),
      get('isError'),
      get('rbacPermissions'),
    );
    mockRelation(get('relations'));
  });

  describe('with all permissions', () => {
    it('renders correctly with all permissions', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when user has some permissions', () => {
    def('relations', () => {
      return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: false };
    });

    it('renders content correctly', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });

  describe('when user has no permissions', () => {
    def('relations', () => {
      return { [Relation.KEYS_VIEW]: false, [Relation.KEYS_EDIT]: false };
    });

    it('renders the NotAuthorized', async () => {
      const { container } = render(<PageContainer />);
      await waitFor(() => expect(useUser).toHaveBeenCalledTimes(1));
      expect(container).toMatchSnapshot();
    });
  });
});
