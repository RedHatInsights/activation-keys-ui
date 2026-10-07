import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { ThProps } from '@patternfly/react-table';
import useActivationKeys from '../../hooks/useActivationKeys';
import Loading from '../LoadingState/Loading';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import DeleteActivationKeyButton from '../ActivationKeys/DeleteActivationKeyButton';
import { printDate, sortByUpdatedAtDate } from '../../utils/dateHelpers';
import type { ActivationKey, SortDirection } from '../../hooks/types';

export interface ActivationKeysTableProps {
  onDelete: (name: string) => void;
}

const ActivationKeysTable = (props: ActivationKeysTableProps) => {
  const { onDelete } = props;
  const columnNames = {
    name: 'Key Name',
    role: 'Role',
    serviceLevel: 'SLA',
    usage: 'Usage',
    updatedAt: 'Updated Date'
  };
  const { isLoading, error, data } = useActivationKeys();
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [sortedData, setSortedData] = React.useState<ActivationKey[]>([]);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  React.useEffect(() => {
    if (data && data.length > 0) {
      const sorted = sortByUpdatedAtDate(data, sortDirection);
      setSortedData(sorted);
    }
  }, [data, sortDirection]);

  const getSortParams = (): ThProps['sort'] => ({
    sortBy: {
      // `null` until the header is first clicked — see the note below.
      index: activeSortIndex as unknown as number | undefined,
      direction: sortDirection
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setSortDirection(direction);
    },
    // NOTE: the original JS omitted `columnIndex`. PatternFly computes
    // `isSortedBy = sortBy && columnIndex === sortBy.index` and calls back with
    // that same `undefined`, so the header renders unsorted until the first
    // click (`undefined === null`) and sorted from then on (`undefined ===
    // undefined`). It happens to work, but only by accident — passing a real
    // `columnIndex` would be correct. Preserved as-is; worth a follow-up ticket.
    columnIndex: undefined as unknown as number
  });

  const Results = () => {
    return (
      <Table aria-label="ActivationKeys">
        <Thead>
          <Tr ouiaSafe={true}>
            <Th width={40}>{columnNames.name}</Th>
            <Th>{columnNames.role}</Th>
            <Th>{columnNames.serviceLevel}</Th>
            <Th>{columnNames.usage}</Th>
            <Th width={20} sort={getSortParams()}>
              {columnNames.updatedAt}
            </Th>
            <Td></Td>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((datum) => {
            return (
              <Tr key={datum.name} ouiaSafe={true}>
                <Td modifier="breakWord" dataLabel={columnNames.name}>
                  <Link to={`${datum.name}`}> {datum.name}</Link>
                </Td>
                <Td dataLabel={columnNames.role}>{datum.role}</Td>
                <Td dataLabel={columnNames.serviceLevel}>{datum.serviceLevel}</Td>
                <Td dataLabel={columnNames.usage}>{datum.usage}</Td>
                <Td dataLabel={columnNames.updatedAt}>
                  {datum.updatedAt ? printDate(datum.updatedAt) : 'Not Available'}
                </Td>
                <Td>
                  <DeleteActivationKeyButton onClick={() => onDelete(datum.name)} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  if (isLoading && !error) {
    return <Loading />;
  } else if (!isLoading && !error) {
    return <Results />;
  } else {
    return <Unavailable />;
  }
};

export default ActivationKeysTable;
