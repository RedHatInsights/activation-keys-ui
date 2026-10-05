import React from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import AddCircleOIcon from '@patternfly/react-icons/dist/dynamic/icons/add-circle-o-icon';
import CreateActivationKeyButton from '../ActivationKeys/CreateActivationKeyButton';

interface NoActivationKeysFoundProps {
  handleModalToggle: () => void;
}

const NoActivationKeysFound = (props: NoActivationKeysFoundProps) => {
  const { handleModalToggle } = props;
  return (
    <>
      <EmptyState headingLevel="h5" icon={AddCircleOIcon} titleText="No activation keys">
        <EmptyStateBody>
          You currently have no activation keys to display. Activation keys allow you to register a
          system with system purpose, role and usage attached.
        </EmptyStateBody>
        <EmptyStateFooter>
          <CreateActivationKeyButton onClick={handleModalToggle} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export default NoActivationKeysFound;
