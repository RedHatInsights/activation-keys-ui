import React, { useState } from 'react';
import { ActionGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { PageSectionVariants } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { Split } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { SplitItem } from '@patternfly/react-core/dist/dynamic/layouts/Split';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import ActivationKeysTable from '../ActivationKeysTable';
import { useQueryClient } from '@tanstack/react-query';
import NoActivationKeysFound from '../EmptyState';
import ActivationKeyWizard from '../Modals/ActivationKeyWizard';
import useActivationKeys from '../../hooks/useActivationKeys';
import Loading from '../LoadingState/Loading';
import CreateActivationKeyButton from './CreateActivationKeyButton';
import DeleteActivationKeyConfirmationModal from '../Modals/DeleteActivationKeyConfirmationModal';
import ActivationKeysDocsPopover from '../ActivationKeysDocsPopover';
import { Main } from '@redhat-cloud-services/frontend-components/Main';

const ActivationKeys = () => {
  const { updateDocumentTitle } = useChrome();
  updateDocumentTitle?.('Activation Keys - System Configuration | RHEL', true);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);
  const { isLoading, error, data } = useActivationKeys();
  const [isOpen, setisOpen] = useState(false);
  const [currentKeyName, setCurrentKeyName] = useState('');

  const [isDeleteActivationKeyModalOpen, setIsDeleteActivationKeyModalOpen] =
    useState(false);
  const handleModalToggle = () => {
    setisOpen(!isOpen);
  };

  const popoverContent = (
    <TextContent className="pf-v5-u-font-size-sm">
      <Text>
        Activation keys assist you in registering systems. Metadata such as
        role, system purpose, and usage can be automatically attached to systems
        via an activation key, and monitored with &nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={'https://console.redhat.com/insights/subscriptions/rhel'}
        >
          Subscription Watch.
        </a>
      </Text>
      <Text>
        To register with an activation key, you will need your organization ID:{' '}
        <b>{user.orgId}</b>
      </Text>
    </TextContent>
  );

  const setKeyName = (modalOpen, name) => {
    let currentName = modalOpen ? '' : name;
    setCurrentKeyName(currentName);
  };

  const handleDeleteActivationKeyModalToggle = (name) => {
    setKeyName(isDeleteActivationKeyModalOpen, name);
    setIsDeleteActivationKeyModalOpen(!isDeleteActivationKeyModalOpen);
  };

  return (
    <React.Fragment>
      <PageHeader>
        <Split hasGutter className="page-title">
          <SplitItem isFilled>
            <Flex>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <PageHeaderTitle title="Activation Keys" />
              </FlexItem>
              <FlexItem>
                <ActivationKeysDocsPopover
                  popoverContent={popoverContent}
                  title="Activation Keys"
                  position="right"
                />
              </FlexItem>
            </Flex>
          </SplitItem>
        </Split>
        <TextContent>
          <Text component={TextVariants.p}>Organization ID: {user.orgId}</Text>
        </TextContent>
      </PageHeader>
      <Main>
        <PageSection variant={PageSectionVariants.light}>
          {isLoading && <Loading />}
          {!isLoading && !error && data.length > 0 && (
            <>
              <ActionGroup>
                <CreateActivationKeyButton onClick={handleModalToggle} />
              </ActionGroup>
              <ActivationKeysTable
                onDelete={handleDeleteActivationKeyModalToggle}
              />
            </>
          )}
          {!isLoading && !error && !data.length && (
            <NoActivationKeysFound handleModalToggle={handleModalToggle} />
          )}
        </PageSection>
      </Main>
      <ActivationKeyWizard
        key={isOpen}
        isOpen={isOpen}
        handleModalToggle={handleModalToggle}
      />
      <DeleteActivationKeyConfirmationModal
        handleModalToggle={handleDeleteActivationKeyModalToggle}
        isOpen={isDeleteActivationKeyModalOpen}
        name={currentKeyName}
      />
    </React.Fragment>
  );
};

export default ActivationKeys;
