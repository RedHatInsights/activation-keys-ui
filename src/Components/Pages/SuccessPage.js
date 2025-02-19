import React from 'react';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { EmptyStateActions } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import CheckCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/check-circle-icon';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate/useInsightsNavigate';
import PropTypes from 'prop-types';

const SuccessPage = ({ isLoading, name, onClose, isEditMode }) => {
  const navigate = useInsightsNavigate();

  const titleText = isEditMode
    ? 'Edit activation key'
    : 'Activation key created';
  const bodyText = isEditMode
    ? `${name} has been edited and is now ready for use. Click View activation key to view the change(s) in the details page.`
    : `${name} is now available for use. Click "View activation key" to edit settings or add repositories.`;

  const content = isLoading ? (
    <Spinner />
  ) : (
    <EmptyState>
      <EmptyStateHeader
        titleText={titleText}
        icon={<EmptyStateIcon color="green" icon={CheckCircleIcon} />}
        headingLevel="h4"
      />
      <EmptyStateBody>{bodyText}</EmptyStateBody>
      <EmptyStateFooter>
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            navigate(`/activation-keys/${name}`);
          }}
        >
          View activation key
        </Button>
        <EmptyStateActions>
          <Button variant="link" onClick={onClose}>
            Close
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
  return <Bullseye>{content}</Bullseye>;
};
SuccessPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default SuccessPage;
