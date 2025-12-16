import React, { useState } from 'react';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
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
    <Content className="pf-v6-u-font-size-sm">
      <Content component="p">
        Activation keys assist you in registering systems. Metadata such as
        role, system purpose, and usage can be automatically attached to systems
        via an activation key, and monitored with &nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={'https://console.redhat.com/insights/subscriptions/rhel'}
        >
          Subscription Services.
        </a>
      </Content>
      <Content component="p">
        To register with an activation key, you will need your organization ID:{' '}
        <b>{user.orgId}</b>
      </Content>
    </Content>
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
            <Split>
              <SplitItem spacer={{ default: 'spacerSm' }}>
                <PageHeaderTitle title="Activation Keys" />
              </SplitItem>
              <SplitItem>
                <ActivationKeysDocsPopover
                  popoverContent={popoverContent}
                  title="Activation Keys"
                  position="right"
                />
              </SplitItem>
            </Split>
          </SplitItem>
          {!isLoading && !error && data.length > 0 && (
            <SplitItem className="pf-v5-u-align-self-flex-start">
              <CreateActivationKeyButton onClick={handleModalToggle} />
            </SplitItem>
          )}
        </Split>
        <Content>
          <Content component={ContentVariants.p}>
            Organization ID: {user.orgId}
          </Content>
        </Content>
      </PageHeader>
      <Main>
        <PageSection hasBodyWrapper={false}>
          {isLoading && <Loading />}
          {!isLoading && !error && data.length > 0 && (
            <>
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
