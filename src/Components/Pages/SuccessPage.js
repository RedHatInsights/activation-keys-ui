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

const SuccessPage = ({ isLoading, name, onClose }) => {
  const navigate = useInsightsNavigate();

  const content = isLoading ? (
    <Spinner />
  ) : (
    <EmptyState>
      <EmptyStateHeader
        titleText="Activation key created"
        icon={<EmptyStateIcon color="green" icon={CheckCircleIcon} />}
        headingLevel="h4"
      />
      <EmptyStateBody>
        <b>{name}</b> is now available for use. Click <b>View activation key</b>{' '}
        to edit settings or add repositories.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button
          variant="primary"
          onClick={() => navigate(`/activation-keys/${name}`)}
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
};

export default SuccessPage;
