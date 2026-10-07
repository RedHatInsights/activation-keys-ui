import React, { useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { ThProps } from '@patternfly/react-table';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import RemoveAdditionalRepositoriesButton from './RemoveAdditionalRepositoriesButton';
import NoAdditionalRepositories from './NoAdditionalRepositories';
import DeleteAdditionalRepositoriesModal from '../Modals/DeleteAdditionalRepositoriesModal';
import type { AdditionalRepository, SortDirection } from '../../hooks/types';

export interface AdditionalRepositoriesTableProps {
  repositories: AdditionalRepository[];
  name: string;
}

const AdditionalRepositoriesTable = (props: AdditionalRepositoriesTableProps) => {
  const { repositories, name } = props;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [activeSortIndex, setActiveSortIndex] = useState<number | undefined>(undefined);
  const [activeSortDirection, setActiveSortDirection] = useState<SortDirection | undefined>(
    undefined
  );
  const [repositoryNameToDelete, setRepositoryNameToDelete] = useState<string | undefined>('');
  const [repositoryLabelToDelete, setRepositoryLabelToDelete] = useState<string | undefined>('');
  const [isDeleteAdditionalRepositoriesModalOpen, setisDeleteAdditionalRepositoriesModalOpen] =
    useState(false);
  const columnNames = {
    repositoryLabel: 'Label',
    repositoryName: 'Name'
  };

  const getSortableRowValues = (repo: AdditionalRepository): (string | undefined)[] => {
    const { repositoryName, repositoryLabel } = repo;
    return [repositoryName, repositoryLabel];
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const sortRepos = (repositories: AdditionalRepository[], sortIndex: number | undefined) => {
    const sortedRepos = repositories?.sort((a, b) => {
      const aValue =
        (sortIndex === undefined ? undefined : getSortableRowValues(a)[sortIndex]) || '';
      const bValue =
        (sortIndex === undefined ? undefined : getSortableRowValues(b)[sortIndex]) || '';
      let result = 0;
      if (aValue < bValue) {
        result = -1;
      } else if (aValue > bValue) {
        result = 1;
      }
      return activeSortDirection == 'asc' ? result : -1 * result;
    });
    return sortedRepos;
  };

  const getPage = (repo: AdditionalRepository[] | undefined) => {
    const first = (page - 1) * perPage;
    const last = first + perPage;
    return repo?.slice(first, last);
  };

  const handleSetPage = (_event: unknown, page: number) => {
    setPage(page);
  };

  const handlePerPageSelect = (_event: unknown, perPage: number) => {
    setPerPage(perPage);
    setPage(1);
  };

  const PaginationTop = () => (
    <Pagination
      itemCount={sortedRepositories?.length}
      perPage={perPage}
      page={page}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      variant={PaginationVariant.top}
      isCompact
      aria-label="pagination-top"
    />
  );

  const PaginationBottom = () => (
    <Pagination
      itemCount={sortedRepositories?.length}
      perPage={perPage}
      page={page}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      variant={PaginationVariant.bottom}
      aria-label="pagination-bottom"
    />
  );

  const sortedRepositories = sortRepos(repositories, activeSortIndex);
  const paginatedRepos = getPage(sortedRepositories);

  const handleDeleteAdditionalRepositoriesToggle = (
    repositoryName?: string,
    repositoryLabel?: string
  ) => {
    setisDeleteAdditionalRepositoriesModalOpen(!isDeleteAdditionalRepositoriesModalOpen);
    setRepositoryNameToDelete(repositoryName);
    setRepositoryLabelToDelete(repositoryLabel);
  };

  return (
    <React.Fragment>
      <PaginationTop />
      <Table aria-label="ActivationKeys">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)} width={40}>
              {columnNames.repositoryName}
            </Th>
            <Th sort={getSortParams(1)}>{columnNames.repositoryLabel}</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {paginatedRepos?.map((repository, rowIndex) => {
            return (
              <Tr key={rowIndex} ouiaSafe={true}>
                <Td dataLabel={columnNames.repositoryName}>{repository.repositoryName}</Td>
                <Td dataLabel={columnNames.repositoryLabel}>{repository.repositoryLabel}</Td>
                <Td>
                  <RemoveAdditionalRepositoriesButton
                    onClick={() =>
                      handleDeleteAdditionalRepositoriesToggle(
                        repository.repositoryName,
                        repository.repositoryLabel
                      )
                    }
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <DeleteAdditionalRepositoriesModal
        name={name}
        isOpen={isDeleteAdditionalRepositoriesModalOpen}
        handleModalToggle={handleDeleteAdditionalRepositoriesToggle}
        repositoryNameToDelete={repositoryNameToDelete}
        repositoryLabelToDelete={repositoryLabelToDelete}
      />
      {repositories.length === 0 && <NoAdditionalRepositories />}
      <PaginationBottom />
    </React.Fragment>
  );
};

export default AdditionalRepositoriesTable;
