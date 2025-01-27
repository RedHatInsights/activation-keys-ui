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
import useActivationKey from '../../hooks/useActivationKey';
import Loading from '../LoadingState/Loading';
import SystemPurposeCard from './SystemPurposeCard';
import WorkloadCard from './WorkloadCard';
import useReleaseVersions from '../../hooks/useReleaseVersions';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import EditAndDeleteDropdown from './EditAndDeleteDropdown';

const ActivationKey = () => {
  const { id } = useParams();
  const breadcrumbs = [
    { title: 'Activation Keys', to: '..' },
    { title: id, isActive: true },
  ];
  const {
    isLoading: isKeyLoading,
    error: keyError,
    data: activationKey,
  } = useActivationKey(id);
  console.log(activationKey);
  const { data: releaseVersions } = useReleaseVersions();

  const [isEditActivationKeyModalOpen, setIsEditActivationKeyModalOpen] =
    useState(false);
  const [isEditActivationKeyWizardOpen, setIsEditActivationKeyWizardOpen] =
    useState(false);
  const [isEditReleaseVersionModalOpen, setIsEditReleaseVersionModalOpen] =
    useState(false);

  const handleEditActivationKeyModalToggle = () => {
    setIsEditActivationKeyModalOpen(!isEditActivationKeyModalOpen);
  };

  const handleEditActivationKeyWizardToggle = (name) => {
    setKeyName(isEditActivationKeyWizardOpen, name);
    setIsEditActivationKeyWizardOpen(!isEditActivationKeyWizardOpen);
  };

  const handleEditReleaseVersionModalToggle = () => {
    setIsEditReleaseVersionModalOpen(!isEditReleaseVersionModalOpen);
  };
  const [currentKeyName, setCurrentKeyName] = useState('');

  const setKeyName = (modalOpen, name) => {
    let currentName = modalOpen ? '' : name;
    setCurrentKeyName(currentName);
  };

  // const editModalDescription =
  //   'System purpose values are used by the subscriptions service to help filter and identify hosts. Setting values for these attributes is optional, but doing so ensures that subscriptions reporting accurately reflects the system. Only those values available to your account are shown.';
  console.log(activationKey);

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
            {activationKey && (
              <EditAndDeleteDropdown
                onClick={handleEditActivationKeyWizardToggle}
                activationKey={activationKey}
                activationKeyName={currentKeyName}
                releaseVersions={releaseVersions}
              />
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
                    <SystemPurposeCard
                      activationKey={activationKey}
                      actionHandler={handleEditActivationKeyModalToggle}
                    />
                  </GalleryItem>
                  <GalleryItem>
                    <WorkloadCard
                      activationKey={activationKey}
                      actionHandler={handleEditReleaseVersionModalToggle}
                    />
                  </GalleryItem>
                </Gallery>
              </GridItem>
              <GridItem span={12}>
                <AdditionalRepositoriesCard
                  activationKey={activationKey}
                  actionHandler={handleEditActivationKeyModalToggle}
                />
              </GridItem>
            </Grid>
          </Main>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ActivationKey;
