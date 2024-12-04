import React from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import PropTypes from 'prop-types';
import AddCircleOIcon from '@patternfly/react-icons/dist/dynamic/icons/add-circle-o-icon';
import CreateActivationKeyButton from '../ActivationKeys/CreateActivationKeyButton';

const NoActivationKeysFound = (props) => {
  const { handleModalToggle } = props;
  return (
    <>
      <EmptyState>
        <EmptyStateHeader
          titleText="No activation keys"
          icon={<EmptyStateIcon icon={AddCircleOIcon} />}
          headingLevel="h5"
        />
        <EmptyStateBody>
          You currently have no activation keys to display. Activation keys
          allow you to register a system with system purpose, role and usage
          attached.
        </EmptyStateBody>
        <EmptyStateFooter>
          <CreateActivationKeyButton onClick={handleModalToggle} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

NoActivationKeysFound.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
};

export default NoActivationKeysFound;
