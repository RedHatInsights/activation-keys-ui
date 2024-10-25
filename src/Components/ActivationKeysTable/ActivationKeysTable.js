import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import useActivationKeys from '../../hooks/useActivationKeys';
import Loading from '../LoadingState/Loading';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';
import DeleteActivationKeyButton from '../ActivationKeys/DeleteActivationKeyButton';
import { printDate, sortActivationKeys } from '../../utils/dateHelpers';
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
  const [updatedDate, setUpdateDate] = React.useState(null);
  const [sortedData, setSortedData] = React.useState([]);
  const [sortDirection, setSortDirection] = React.useState(null);
  const location = useLocation();
  React.useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const getSortParams = (updatedDateField) => ({
    sortBy: {
      updatedAt: updatedDate,
      direction: sortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, updatedAt, direction) => {
      setUpdateDate(updatedAt);
      setSortDirection(direction);
      const sorted = sortActivationKeys(
        sortedData,
        updatedDateField,
        direction
      );
      setSortedData(sorted);
    },
    updatedDateField,
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
            <Th width={20} sort={getSortParams('updatedAt')}>
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
