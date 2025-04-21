import React from 'react';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import AddCircleOIcon from '@patternfly/react-icons/dist/dynamic/icons/add-circle-o-icon';

const NoAdditionalRepositories = () => {
  return (
    <>
      <EmptyState
        headingLevel="h5"
        icon={AddCircleOIcon}
        titleText="No additional repositories"
      >
        <EmptyStateBody>
          You currently have no additional repositories to display.
        </EmptyStateBody>
      </EmptyState>
    </>
  );
};

export default NoAdditionalRepositories;
