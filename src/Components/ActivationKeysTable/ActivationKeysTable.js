import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import useActivationKeys from '../../hooks/useActivationKeys';
import Loading from '../LoadingState/Loading';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import DeleteActivationKeyButton from '../ActivationKeys/DeleteActivationKeyButton';
import PropTypes from 'prop-types';

const ActivationKeysTable = (props) => {
  const { onDelete } = props;
  const columnNames = {
    name: 'Key Name',
    role: 'Role',
    serviceLevel: 'SLA',
    usage: 'Usage',
    updatedAt: 'Updated Date',
  };
  const { isLoading, error, data } = useActivationKeys();
  console.log(data);
  const [activeSortIndex, setActiveSortIndex] = React.useState(null);
  const [sortedData, setSortedData] = React.useState([]);
  const [activeSortDirection, setActiveSortDirection] = React.useState(null);
  const location = useLocation();
  React.useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const getSortParams = (columnIndex) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
      const sorted = [...sortedData].sort((a, b) => {
        const aValue = a[columnNames[index]];
        const bValue = b[columnNames[index]];
        if (index === 4) {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          if (direction === 'asc') {
            return aDate - bDate;
          } else {
            return bDate - aDate;
          }
        }
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      setSortedData(sorted);
    },
    columnIndex,
  });

  const printDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${date.getUTCFullYear()}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  };

  const Results = () => {
    return (
      <Table aria-label="ActivationKeys">
        <Thead>
          <Tr ouiaSafe={true}>
            <Th width={40}>{columnNames.name}</Th>
            <Th>{columnNames.role}</Th>
            <Th>{columnNames.serviceLevel}</Th>
            <Th>{columnNames.usage}</Th>
            <Th sort={getSortParams(4)} width={20}>
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
                  <Link to={`${location.pathname}/${datum.name}`}>
                    {' '}
                    {datum.name}
                  </Link>
                </Td>
                <Td dataLabel={columnNames.role}>{datum.role}</Td>
                <Td dataLabel={columnNames.serviceLevel}>
                  {datum.serviceLevel}
                </Td>
                <Td dataLabel={columnNames.usage}>{datum.usage}</Td>
                <Td dataLabel={columnNames.updatedAt}>
                  {datum.updatedAt == new Date(0)
                    ? 'Not Available'
                    : printDate(datum.updatedAt)}
                </Td>
                <Td>
                  <DeleteActivationKeyButton
                    onClick={() => onDelete(datum.name)}
                  />
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

ActivationKeysTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default ActivationKeysTable;
