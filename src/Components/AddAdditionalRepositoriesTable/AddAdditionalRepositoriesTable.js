import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Pagination,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useEffect, useState } from 'react';
import Loading from '../LoadingState/Loading';
import AddAdditionalRepositoriesToolbar from './AddAdditionalRepositoriesToolbar';
import propTypes from 'prop-types';
import useAvailableRepositories, { usePrefetchAvailableRepositoriesNextPate } from '../../hooks/useAvailableRepositories';
import { useQueryClient } from '@tanstack/react-query';
import { useDebouncedState } from '../../hooks/useDebouncedState';

const AddAdditionalRepositoriesTable = (props) => {
  const {
    keyName,
    selectedRepositories,
    setSelectedRepositories,
    isSubmitting,
  } = props;

  const [filter, setFilter] = useDebouncedState('', 300);
  const [filterBy, setFilterBy] = useState('repositoryName');
  const [onlyShowSelectedRepositories, setOnlyShowSelectedRepositories] =
    useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  const [activeSortDirection, setActiveSortDirection] = useState('asc');
  const friendlyNameMap = {
    repositoryName: 'Name',
    repositoryLabel: 'Label',
  };
  const queryClient = useQueryClient()
  const prefetchNextPage = usePrefetchAvailableRepositoriesNextPate()

  const {
    data: repositoriesData,
    isLoading,
  } = useAvailableRepositories(keyName, page, perPage, filter);

  // prefetch the next page
  useEffect(() => {
      prefetchNextPage(queryClient, keyName, page + 1, perPage, filter);
  }, [page, perPage, filter])

  useEffect(() => {
    setPage(1);
  }, [onlyShowSelectedRepositories]);

  const getSortableRowValues = (repo) => {
    const { repositoryName, repositoryLabel } = repo;
    return [repositoryName, repositoryLabel];
  };

  const getSortParams = (columnIndex) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const sortRepositories = (repositories) => {
    return repositories.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex] || '';
      const bValue = getSortableRowValues(b)[activeSortIndex] || '';
      let result = 0;

      if (aValue < bValue) {
        result = -1;
      } else if (aValue > bValue) {
        result = 1;
      }

      return activeSortDirection == 'asc' ? result : -1 * result;
    });
  };

  const pagination = (
    <Pagination
      itemCount={repositoriesData?.pagination.total}
      perPage={perPage}
      page={page}
      onSetPage={(_, newPage) => setPage(newPage)}
      onPerPageSelect={(_, newPerPage, newPage) => {
        setPerPage(newPerPage);
        setPage(newPage);
      }}
      isCompact
      isDisabled={isSubmitting}
    />
  );

  const emptyState = (
    <EmptyState>
      <EmptyStateHeader
        titleText="No results found"
        icon={<EmptyStateIcon icon={SearchIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>
        No results match the filter criteria. Clear all filters and try again.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="link" onClick={() => setFilter('')}>
            Clear all filters
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );

  return (
    <>
      <AddAdditionalRepositoriesToolbar
        friendlyNameMap={friendlyNameMap}
        filter={filter}
        setFilter={setFilter}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        dropdownSelectisDisabled={isSubmitting}
        selectedOnlyToggleIsDisabled={
          (!onlyShowSelectedRepositories &&
            selectedRepositories.length === 0) ||
          isSubmitting
        }
        searchIsDisabled={isSubmitting}
        pagination={pagination}
        onlyShowSelectedRepositories={onlyShowSelectedRepositories}
        setOnlyShowSelectedRepositories={setOnlyShowSelectedRepositories}
      />
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th />
            <Th sort={getSortParams(0)}>{friendlyNameMap.repositoryName}</Th>
            <Th sort={getSortParams(1)}>{friendlyNameMap.repositoryLabel}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isLoading && repositoriesData.body.map((repository, rowIndex) => (
            <Tr key={repository.repositoryLabel}>
              <Td
                select={{
                  rowIndex,
                  isSelected: selectedRepositories.includes(repository),
                  onSelect: (_, isSelecting) => {
                    if (isSubmitting) {
                      return;
                    }
                    if (isSelecting) {
                      setSelectedRepositories([
                        ...selectedRepositories,
                        repository,
                      ]);
                    } else {
                      setSelectedRepositories(
                        selectedRepositories.filter(
                          (selectedRepository) =>
                            selectedRepository.repositoryLabel !==
                            repository.repositoryLabel
                        )
                      );
                    }
                  },
                }}
              />
              <Td>{repository.repositoryName}</Td>
              <Td>{repository.repositoryLabel}</Td>
            </Tr>
          ))}
          {!isLoading && repositoriesData.body.length === 0 && (
            <Tr>
              <Td colSpan={8}>
                <Bullseye>{emptyState}</Bullseye>
              </Td>
            </Tr>
          )}
          {isLoading && <Loading />}
        </Tbody>
      </Table>
      {pagination}
    </>
  );
};

AddAdditionalRepositoriesTable.propTypes = {
  repositories: propTypes.array.isRequired,
  isLoading: propTypes.bool.isRequired,
  error: propTypes.bool.isRequired,
  selectedRepositories: propTypes.array.isRequired,
  setSelectedRepositories: propTypes.func.isRequired,
  isSubmitting: propTypes.bool,
};

export default AddAdditionalRepositoriesTable;
