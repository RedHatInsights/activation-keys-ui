import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import AdditionalRepositoriesTable from '../AdditionalRepositoriesTable';
import { def, get } from 'bdd-lazy-var';
import '@testing-library/jest-dom';
import useAvailableRepositories from '../../../hooks/useAvailableRepositories';
import { Relation, type RelationValue, useHasRelation } from '../../../hooks/useHasRelation';
jest.mock('../../../hooks/useAvailableRepositories');
jest.mock('uuid', () => {
  return { v4: jest.fn(() => '00000000-0000-0000-0000-000000000000') };
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({ url: '/' })
}));
jest.mock('../../../hooks/useHasRelation');

const queryClient = new QueryClient();

const mockUseAvailableRepositories = useAvailableRepositories as unknown as jest.Mock;
const mockUseHasRelation = useHasRelation as unknown as jest.Mock;

const mockRelation = (map: Partial<Record<RelationValue, boolean>>) => {
  mockUseHasRelation.mockImplementation((r: RelationValue) => ({
    has: map?.[r] || false,
    isLoading: false
  }));
};

/**
 * NOTE: `AdditionalRepositoriesTable` also requires a `name` prop, which these
 * tests omit. Preserved verbatim.
 */
const AdditionalRepositoriesTableWithoutName = AdditionalRepositoriesTable as unknown as (props: {
  repositories: { repositoryLabel: string }[];
}) => React.ReactElement;

describe('AdditionalRepositoriesTable', () => {
  def('relations', () => {
    return { [Relation.KEYS_VIEW]: true, [Relation.KEYS_EDIT]: true };
  });
  def('loading', () => false);
  def('error', () => false);
  def('data', () => [
    {
      name: 'A',
      role: 'B',
      serviceLevel: 'C',
      usage: 'D'
    }
  ]);
  beforeEach(() => {
    mockUseAvailableRepositories.mockReturnValue({
      isLoading: get('loading'),
      error: get('error'),
      data: get('data')
    });
    mockRelation(get('relations'));
  });
  const repositories = [
    {
      repositoryLabel: 'label-a'
    },
    {
      repositoryLabel: 'label-b'
    }
  ];

  it('renders correctly', () => {
    const Table = () => (
      <QueryClientProvider client={queryClient}>
        <AdditionalRepositoriesTableWithoutName repositories={repositories} />
      </QueryClientProvider>
    );

    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  describe('when row column headings are clicked', () => {
    const repositories = [
      {
        repositoryLabel: 'label-a'
      },
      {
        repositoryLabel: 'label-b'
      },
      {
        repositoryLabel: 'label-c'
      }
    ];

    it('can sort by name', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      fireEvent.click(screen.getByText('Name'));

      expect(container).toMatchSnapshot();
    });

    it('can sort by name, reversed', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      fireEvent.click(screen.getByText('Name'));
      fireEvent.click(screen.getByText('Name'));

      expect(container).toMatchSnapshot();
    });

    it('can sort by label', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      fireEvent.click(screen.getByText('Label'));

      expect(container).toMatchSnapshot();
    });

    it('can sort by label, reversed', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      fireEvent.click(screen.getByText('Label'));
      fireEvent.click(screen.getByText('Label'));

      expect(container).toMatchSnapshot();
    });
  });

  describe('when using pagination', () => {
    const repositories = [...Array(12).keys()].map((id) => ({
      repositoryLabel: `label-${id}`
    }));
    it('can change page', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      const nextPage = screen.getAllByLabelText('Go to next page')[0];
      fireEvent.click(nextPage);

      expect(container).toMatchSnapshot();
    });
    it('can change per page', () => {
      const Table = () => (
        <QueryClientProvider client={queryClient}>
          <AdditionalRepositoriesTableWithoutName repositories={repositories} />
        </QueryClientProvider>
      );

      const { container } = render(<Table />);
      const PaginationTop = screen.getByLabelText('pagination-top');
      const arrowIcon = (PaginationTop.children[1].firstChild as Element).children[1];
      fireEvent.click(arrowIcon);
      const perPageAmout = screen.getByText('20 per page');
      fireEvent.click(perPageAmout);

      expect(container).toMatchSnapshot();
    });
  });
});
