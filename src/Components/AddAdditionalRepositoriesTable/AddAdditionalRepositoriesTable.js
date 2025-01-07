import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { EmptyStateActions } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import useAvailableRepositories, {
  usePrefetchAvailableRepositoriesNextPage,
} from '../../hooks/useAvailableRepositories';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useEffect, useState } from 'react';
import Loading from '../LoadingState/Loading';
import AddAdditionalRepositoriesToolbar from './AddAdditionalRepositoriesToolbar';
import propTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { useDebouncedState } from '../../hooks/useDebouncedState';

const AddAdditionalRepositoriesTable = (props) => {
  const {
    keyName,
    selectedRepositories,
    setSelectedRepositories,
    isSubmitting,
  } = props;

  const sort_by_index = ['repo_name', 'repo_label'];

  const [filter, setFilter] = useDebouncedState('', 300);
  const queryClient = useQueryClient();
  const [filterBy, setFilterBy] = useState('repo_name');
  const [onlyShowSelectedRepositories, setOnlyShowSelectedRepositories] =
    useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  const [activeSortDirection, setActiveSortDirection] = useState('asc');
  const [activeSortBy, setActiveSortBy] = useState(sort_by_index[0]);
  const friendlyNameMap = {
    repo_name: 'Name',
    repo_label: 'Label',
  };

  const attrMap = {
    repo_name: 'repositoryName',
    repo_label: 'repositoryLabel',
  };

  const { data: repositoriesData, isLoading } = useAvailableRepositories(
    keyName,
    page,
    perPage,
    filterBy,
    filter,
    activeSortBy,
    activeSortDirection
  );

  const prefetchNextPage = usePrefetchAvailableRepositoriesNextPage();

  useEffect(() => {
    setPage(1);
  }, [onlyShowSelectedRepositories, filter]);

  useEffect(() => {
    prefetchNextPage(
      queryClient,
      keyName,
      page + 1,
      perPage,
      filterBy,
      filter,
      activeSortBy,
      activeSortDirection
    );
  }, [page, perPage, filter]);

  const getSortParams = (columnIndex) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
      setActiveSortBy(sort_by_index[index]);
    },
    columnIndex,
  });

  const pagination = (
    <Pagination
      itemCount={
        onlyShowSelectedRepositories
          ? selectedRepositories.length
          : repositoriesData?.pagination.total
      }
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

  const displayedSelectedRepos = selectedRepositories
    .filter((repo) => {
      if (filter == '') {
        return true;
      } else {
        return repo[attrMap[filterBy]]
          .toLowerCase()
          .includes(filter.toLowerCase());
      }
    })
    .filter((_, i) => {
      return i >= (page - 1) * perPage && i < page * perPage;
    })
    .sort((a, b) => {
      let res = 0;
      const aComp = a[attrMap[activeSortBy]];
      const bComp = b[attrMap[activeSortBy]];
      if (bComp < aComp) {
        res = 1;
      } else if (aComp < bComp) {
        res = -1;
      }
      return activeSortDirection == 'asc' ? res : res * -1;
    });

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
          {(!isLoading || onlyShowSelectedRepositories) &&
            (onlyShowSelectedRepositories
              ? displayedSelectedRepos
              : repositoriesData.body
            ).map((repository, rowIndex) => (
              <Tr key={repository.repositoryLabel}>
                <Td
                  select={{
                    rowIndex,
                    isSelected:
                      selectedRepositories.find(
                        (selected) =>
                          repository.repositoryLabel == selected.repositoryLabel
                      ) != undefined,
                    onSelect: (_, isSelecting) => {
                      if (isSubmitting) {
                        return;
                      }
                      if (isSelecting) {
                        if (
                          selectedRepositories.find(
                            (selected) =>
                              selected.repositoryLabel ==
                              repository.repositoryLabel
                          ) == undefined
                        ) {
                          setSelectedRepositories([
                            ...selectedRepositories,
                            repository,
                          ]);
                        }
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
          {repositoriesData && repositoriesData.body.length === 0 && (
            <Tr>
              <Td colSpan={8}>
                <Bullseye>{emptyState}</Bullseye>
              </Td>
            </Tr>
          )}
          {isLoading && !onlyShowSelectedRepositories && (
            <Tr>
              <Td colSpan={8}>
                <Bullseye>
                  <Loading />
                </Bullseye>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {pagination}
    </>
  );
};

AddAdditionalRepositoriesTable.propTypes = {
  keyName: propTypes.string.isRequired,
  selectedRepositories: propTypes.array.isRequired,
  setSelectedRepositories: propTypes.func.isRequired,
  isSubmitting: propTypes.bool,
};

export default AddAdditionalRepositoriesTable;
