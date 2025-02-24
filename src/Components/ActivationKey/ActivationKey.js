import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../shared/breadcrumbs';
import {
  TextVariants,
  Grid,
  GridItem,
  Gallery,
  GalleryItem,
  Level,
  LevelItem,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import AdditionalRepositoriesCard from './AdditionalRepositoriesCard';
import { useQueryClient } from '@tanstack/react-query';
import NoAccessPopover from '../NoAccessPopover';
import useActivationKey from '../../hooks/useActivationKey';
import Loading from '../LoadingState/Loading';
import SystemPurposeCard from './SystemPurposeCard';
import WorkloadCard from './WorkloadCard';
import useReleaseVersions from '../../hooks/useReleaseVersions';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import EditAndDeleteDropdown from './EditAndDeleteDropdown';

const ActivationKey = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);

  const breadcrumbs = [
    { title: 'Activation Keys', to: '..' },
    { title: id, isActive: true },
  ];
  const {
    isLoading: isKeyLoading,
    error: keyError,
    data: activationKey,
  } = useActivationKey(id);
  const { data: releaseVersions } = useReleaseVersions();
  const [isEditActivationKeyWizardOpen, setIsEditActivationKeyWizardOpen] =
    useState(false);
  const handleEditActivationKeyWizardToggle = () => {
    setIsEditActivationKeyWizardOpen(!isEditActivationKeyWizardOpen);
  };

  return (
    <React.Fragment>
      <PageHeader>
        <Level>
          <LevelItem>
            <Breadcrumbs {...breadcrumbs} />
            <PageHeaderTitle className="pf-v5-u-mb-sm" title={id} />
            <DescriptionListGroup className="pf-v5-u-mb-sm">
              {activationKey ? (
                <DescriptionListTerm component={TextVariants.p}>
                  {activationKey?.description || 'No Description'}
                </DescriptionListTerm>
              ) : null}
            </DescriptionListGroup>
          </LevelItem>
          <LevelItem className="pf-v5-u-mb-sm">
            {!isKeyLoading && user.rbacPermissions.canWriteActivationKeys ? (
              <EditAndDeleteDropdown
                onClick={handleEditActivationKeyWizardToggle}
                activationKey={activationKey}
                releaseVersions={releaseVersions}
              />
            ) : (
              <NoAccessPopover content={EditAndDeleteDropdown} />
            )}
          </LevelItem>
        </Level>
      </PageHeader>
      {isKeyLoading && !keyError ? (
        <Loading />
      ) : (
        <React.Fragment>
          <Main>
            <Grid hasGutter>
              <GridItem span={12}>
                <Gallery
                  hasGutter
                  minWidths={{
                    default: '40%',
                  }}
                >
                  <GalleryItem>
                    <SystemPurposeCard activationKey={activationKey} />
                  </GalleryItem>
                  <GalleryItem>
                    <WorkloadCard activationKey={activationKey} />
                  </GalleryItem>
                </Gallery>
              </GridItem>
              <GridItem span={12}>
                <AdditionalRepositoriesCard activationKey={activationKey} />
              </GridItem>
            </Grid>
          </Main>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ActivationKey;
