import React from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import AddCircleOIcon from '@patternfly/react-icons/dist/dynamic/icons/add-circle-o-icon';

const NoAdditionalRepositories = () => {
  return (
    <>
      <EmptyState>
        <EmptyStateHeader
          titleText="No additional repositories"
          icon={<EmptyStateIcon icon={AddCircleOIcon} />}
          headingLevel="h5"
        />
        <EmptyStateBody>
          You currently have no additional repositories to display.
        </EmptyStateBody>
      </EmptyState>
    </>
  );
};

export default NoAdditionalRepositories;
