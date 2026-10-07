import React from 'react';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  EmptyState,
  EmptyStateStatus
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { EmptyStateActions } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate/useInsightsNavigate';
import { useWizardContext } from '@patternfly/react-core/dist/dynamic/components/Wizard';

export interface SuccessPageProps {
  isLoading: boolean;
  name?: string;
  onClose: () => void;
  isEditMode: boolean;
  isError: boolean;
}

const SuccessPage = ({ isLoading, name, onClose, isEditMode, isError }: SuccessPageProps) => {
  // `app` falls back to `chrome.getApp()` at runtime, but the package's .d.ts
  // declares it required, so pass the same undefined explicitly.
  const navigate = useInsightsNavigate(undefined as unknown as string);
  const { goToPrevStep } = useWizardContext();

  const titleText = isEditMode ? 'Edit activation key' : 'Activation key created';
  const bodyText = isEditMode
    ? `${name} has been edited and is now ready for use. Click View activation key to view the change(s) in the details page.`
    : `${name} is now available for use. Click "View activation key" to edit settings or add repositories.`;

  if (!isLoading && isError) {
    goToPrevStep();
  }

  const content = isLoading ? (
    <Spinner />
  ) : (
    <EmptyState headingLevel="h4" status={EmptyStateStatus.success} titleText={titleText}>
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

export default SuccessPage;
