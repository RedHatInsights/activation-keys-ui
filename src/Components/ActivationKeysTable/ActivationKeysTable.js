import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import useActivationKeys from '../../hooks/useActivationKeys';
import Loading from '../LoadingState/Loading';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import DeleteActivationKeyButton from '../ActivationKeys/DeleteActivationKeyButton';
import { printDate, sortByUpdatedAtDate } from '../../utils/dateHelpers';
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
  const [sortedData, setSortedData] = React.useState([]);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const location = useLocation();

  React.useEffect(() => {
    if (data && data.length > 0) {
      const sorted = sortByUpdatedAtDate(data, sortDirection);
      setSortedData(sorted);
    }
  }, [data, sortDirection]);

  const getSortParams = () => ({
    sortBy: {
      index: 4,
      direction: sortDirection,
    },
    onSort: () => {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    },
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
                  {datum.updatedAt
                    ? printDate(datum.updatedAt)
                    : 'Not Available'}
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
