import React, { useEffect, useState } from 'react';

import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import PropTypes from 'prop-types';
import useCreateActivationKey from '../../hooks/useCreateActivationKey';
import useSystemPurposeAttributes from '../../hooks/useSystemPurposeAttributes';
import useNotifications from '../../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import ReviewActivationKeyPage from '../Pages/ReviewActivationKeyPage';
import SetWorkloadPage from '../Pages/SetWorkLoadPage';
import SetSystemPurposePage from '../Pages/SetSystemPurposePage';
import SuccessPage from '../Pages/SuccessPage';
import useActivationKeys from '../../hooks/useActivationKeys';
import NameAndDescriptionPage from '../Pages/NameAndDescriptionPage';
import useUpdateActivationKey from '../../hooks/useUpdateActivationKey';
import useDeleteAdditionalRepositories from '../../hooks/useDeleteAdditionalRepositories';
import useAddAdditionalRepositories from '../../hooks/useAddAdditionalRepositories';
import { ModalFooter } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalHeader } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ModalBody } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { WizardStep } from '@patternfly/react-core/dist/dynamic/components/Wizard';
import { Wizard } from '@patternfly/react-core/dist/dynamic/components/Wizard';
import useEusVersions from '../../hooks/useEusVersions';

const workloadOptions = ['Latest release', 'Extended support releases'];
const confirmCloseTitle = 'Exit activation key creation?';
const confirmCloseBody = (
  <ModalBody>
    <Content variant="p">All inputs will be discarded.</Content>
  </ModalBody>
);
const ConfirmCloseFooter = ({ onClose, returnToWizard }) => (
  <>
    <Button variant="primary" onClick={onClose}>
      Exit
    </Button>
    <Button variant="link" onClick={returnToWizard}>
      Stay
    </Button>
  </>
);
const nameRegex = /^([\w-_])+$/;
const nameValidator = (newName, keyNames) => {
  const match =
    keyNames?.find((name) => {
      return name == newName;
    }) || [];
  return match.length == 0 && nameRegex.test(newName);
};
const descriptionValidator = (description) => {
  const trimmedDescription = description.trim();
  return (
    description === '' ||
    (trimmedDescription.length > 0 && trimmedDescription.length <= 255)
  );
};

const ActivationKeyWizard = ({
  isEditMode,
  activationKey,
  handleModalToggle,
  isOpen,
}) => {
  const queryClient = useQueryClient();
  const {
    mutate: createActivationKey,
    isPending: createActivationKeyIsLoading,
  } = useCreateActivationKey();
  const {
    mutate: updateActivationKey,
    isPending: updateActivationKeyIsLoading,
  } = useUpdateActivationKey();
  const {
    isLoading: attributesAreLoading,
    error,
    data,
  } = useSystemPurposeAttributes();
  const {
    mutate: deleteAdditionalRepositories,
    isPending: isDeleteAdditionalRepositoriesLoading,
  } = useDeleteAdditionalRepositories();
  const {
    mutate: addAdditionalRepositories,
    isPending: isAddAdditionRepositoriesLoading,
  } = useAddAdditionalRepositories();
  const { data: activationKeys } = useActivationKeys();
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [name, setName] = useState('');
  const [description, setDescription] = useState(
    activationKey?.description || '',
  );
  const [extendedReleaseProduct, setExtendedReleaseProduct] = useState('');
  const [extendedReleaseVersion, setExtendedReleaseVersion] = useState('');
  const [extendedReleaseRepositories, setExtendedReleaseRepositories] =
    useState([]);
  const [role, setRole] = useState(activationKey?.role);
  const [sla, setSla] = useState(activationKey?.serviceLevel);
  const [usage, setUsage] = useState(activationKey?.usage);
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [shouldConfirmClose, setShouldConfirmClose] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workload, setWorkload] = useState(() =>
    isEditMode && activationKey?.releaseVersion
      ? 'Extended support releases'
      : 'Latest release',
  );
  const [mutationError, setMutationError] = useState(false);

  useEffect(() => {
    if (isEditMode && activationKey) {
      const previousWorkload = activationKey?.releaseVersion
        ? 'Extended support releases'
        : 'Latest release';

      if (workload !== previousWorkload) {
        setWorkload(previousWorkload);
      }
      if (previousWorkload === 'Extended support release')
        setExtendedReleaseVersion(activationKey?.releaseVersion);
    }
  }, [isEditMode, activationKey]);

  const keyNames = activationKeys?.map((key) => key.name) || [];
  const nameIsValid = nameValidator(name, keyNames);
  const descriptionIsValid = descriptionValidator(description || '');

  const {
    isLoading: isReleaseVersionsLoading,
    error: eusError,
    data: releaseVersions,
  } = useEusVersions();
  const [inferredReleaseProduct, setInferredReleaseProduct] = useState('');
  const [errorInferringProduct, setErrorInferringProduct] = useState(false);

  /**
   * Handle default workload settings
   *
   * Upon render, or workload change, set the correct defaults for release
   * product and version.
   *
   * This needs to be handled upon modal load here, not upon load of the
   * workload page, as if it is skipped over we would accidentally unset
   * the current workload if.
   */
  useEffect(() => {
    if (workload.includes('Extended') && releaseVersions?.length > 0) {
      // In edit, when we are changing EUS products, we need to infer the
      // product based on the repos
      if (isEditMode && activationKey.releaseVersion) {
        const inferredReleaseProduct = releaseVersions.find((product) =>
          product.configurations.find(
            (c) =>
              c.version == activationKey.releaseVersion &&
              c.repositories.every((repo) =>
                activationKey.additionalRepositories.find(
                  (has) => has.repositoryLabel == repo,
                ),
              ),
          ),
        )?.name;

        if (!inferredReleaseProduct) {
          setErrorInferringProduct(true);
        } else {
          setInferredReleaseProduct(inferredReleaseProduct);
        }
      }
      setExtendedReleaseProduct(
        (prev) => inferredReleaseProduct || prev || releaseVersions[0]?.name,
      );
      setExtendedReleaseVersion(
        (prev) =>
          prev ||
          activationKey?.releaseVersion ||
          releaseVersions[0]?.configurations[0]?.version,
      );
    } else {
      setExtendedReleaseProduct('');
      setExtendedReleaseVersion('');
    }
  }, [releaseVersions, workload, inferredReleaseProduct]);

  /**
   * Update the EUS repos
   *
   * Based on the currently selected EUS product and version, set the
   * applicable repos
   */
  useEffect(() => {
    if (
      releaseVersions &&
      workload.includes('Extended') &&
      extendedReleaseProduct
    ) {
      setExtendedReleaseRepositories(
        releaseVersions
          .find((product) => extendedReleaseProduct == product.name)
          .configurations.find(
            (configuration) => extendedReleaseVersion == configuration.version,
          ).repositories,
      );
    } else {
      setExtendedReleaseRepositories([]);
    }
  }, [releaseVersions, extendedReleaseProduct, extendedReleaseVersion]);

  const onClose = () => {
    queryClient.invalidateQueries(['activation_keys']);
    if (activationKey?.name) {
      queryClient.invalidateQueries([`activation_key_${activationKey.name}`]);
      queryClient.resetQueries([`activation_key_${activationKey.name}`]);
    }
    handleModalToggle();
  };

  const confirmClose = () => {
    if (shouldConfirmClose) {
      setIsConfirmClose(true);
    } else {
      onClose();
    }
  };

  const returnToWizard = () => {
    setIsConfirmClose(false);
  };

  const saveChanges = () => {
    const mutationFn = isEditMode ? updateActivationKey : createActivationKey;
    const mutationData = {
      name: isEditMode ? activationKey.name : name,
      description,
      role,
      serviceLevel: sla,
      usage,
      additionalRepositories:
        workload.includes('Extended') && !isEditMode
          ? extendedReleaseRepositories
          : undefined,
      releaseVersion: extendedReleaseVersion,
    };

    if (isEditMode) {
      // missing repos it should have
      const missing = extendedReleaseRepositories.filter((label) => {
        return (
          activationKey.additionalRepositories.findIndex(
            (cur) => cur.repositoryLabel == label,
          ) == -1
        );
      });

      // has repos it shouldn't have
      const extra = activationKey.additionalRepositories.filter((repo) => {
        return (
          extendedReleaseRepositories.findIndex(
            (label) => label == repo.repositoryLabel,
          ) == -1
        );
      });

      if (missing.length != 0 || extra.length != 0) {
        // Clear all repos and add new ones
        deleteAdditionalRepositories(
          {
            name: activationKey.name,
            payload: activationKey.additionalRepositories,
          },
          {
            onError: () => {
              addErrorNotification('Error updating additional repositories');
            },
            onSuccess: () => {
              if (extendedReleaseRepositories.length > 0) {
                addAdditionalRepositories(
                  {
                    keyName: activationKey.name,
                    selectedRepositories: extendedReleaseRepositories.map(
                      (r) => ({
                        repositoryLabel: r,
                      }),
                    ),
                  },
                  {
                    onError: () => {
                      addErrorNotification(
                        'Error updating additional repositories',
                      );
                    },
                  },
                );
              }
            },
          },
        );
      }
    }

    mutationFn(mutationData, {
      onSuccess: () => {
        addSuccessNotification(
          isEditMode
            ? `Changes saved for activation key "${activationKey.name}"`
            : `Activation key "${name}" created`,
        );
        setMutationError(false);
      },
      onError: () => {
        addErrorNotification(
          isEditMode
            ? `Error updating activation key ${activationKey.name}.`
            : 'Something went wrong.',
        );
        setMutationError(true);
      },
    });
  };

  const mode = isEditMode ? 'Edit' : 'Create';
  const steps = [
    {
      name: 'Name and Description',
      component: (
        <NameAndDescriptionPage
          activationKey={activationKey}
          mode={isEditMode}
          name={activationKey?.name || name}
          setName={setName}
          nameIsValid={nameIsValid}
          description={description}
          setDescription={setDescription}
          isNameDisabled={isEditMode}
          descriptionIsValid={descriptionIsValid}
        />
      ),
      customFooter: {
        isNextDisabled: isEditMode
          ? !descriptionIsValid
          : !nameIsValid || !descriptionIsValid,
      },
    },
    {
      name: 'Workload',
      component: (
        <SetWorkloadPage
          activationKey={activationKey}
          isEditMode={isEditMode}
          workloadOptions={workloadOptions}
          workload={workload}
          setWorkload={setWorkload}
          extendedReleaseProduct={extendedReleaseProduct}
          setExtendedReleaseProduct={setExtendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
          setExtendedReleaseVersion={setExtendedReleaseVersion}
          setExtendedReleaseRepositories={setExtendedReleaseRepositories}
          isLoading={isReleaseVersionsLoading}
          error={eusError}
          releaseVersions={releaseVersions}
          errorInferringProduct={errorInferringProduct}
          inferredReleaseProduct={inferredReleaseProduct}
        />
      ),
      isDisabled: !isEditMode && !nameIsValid,
    },
    {
      name: 'System purpose',
      component: (
        <SetSystemPurposePage
          mode={isEditMode}
          activationKey={activationKey}
          role={role}
          setRole={setRole}
          data={data}
          sla={sla}
          setSla={setSla}
          usage={usage}
          setUsage={setUsage}
          isLoading={attributesAreLoading}
          isError={error}
        />
      ),
      isDisabled: !isEditMode && !nameIsValid,
    },
    {
      name: 'Review',
      component: (
        <ReviewActivationKeyPage
          mode={isEditMode}
          activationKey={activationKey}
          name={name}
          description={description}
          workload={workload}
          role={role}
          sla={sla}
          usage={usage}
          isLoading={
            createActivationKeyIsLoading || updateActivationKeyIsLoading
          }
          extendedReleaseProduct={extendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
        />
      ),
      isDisabled: !isEditMode && !nameIsValid,
      customFooter: {
        nextButtonText: isEditMode ? 'Update' : 'Create',
      },
    },
    {
      name: 'Finish',
      component: (
        <SuccessPage
          isLoading={
            createActivationKeyIsLoading ||
            updateActivationKeyIsLoading ||
            isDeleteAdditionalRepositoriesLoading ||
            isAddAdditionRepositoriesLoading
          }
          name={isEditMode ? activationKey?.name : name}
          onClose={onClose}
          isEditMode={isEditMode}
          isError={mutationError}
        />
      ),
      customNav: <></>,
      customFooter: <></>,
    },
  ];

  return (
    <Modal
      variant={isConfirmClose ? ModalVariant.small : ModalVariant.large}
      isOpen={isOpen}
      aria-label={
        isEditMode
          ? 'Edit activation key wizard'
          : 'Create activation key wizard'
      }
      onClose={isConfirmClose ? undefined : confirmClose}
    >
      <ModalHeader
        titleIconVariant={isConfirmClose ? 'warning' : undefined}
        title={
          isConfirmClose
            ? confirmCloseTitle
            : isEditMode
              ? 'Edit activation key'
              : 'Create activation key '
        }
      />
      {!isConfirmClose && (
        <Wizard
          height={800}
          navAriaLabel={`${mode} activation key steps`}
          onStepChange={(_event, step) => {
            setShouldConfirmClose(step.id > 0 && step.id < 4);
            setCurrentStep(step.id);
            if (step.id === 4) {
              saveChanges();
            }
          }}
          startIndex={currentStep + 1}
          onClose={confirmClose}
          isVisitRequired={!isEditMode}
        >
          {steps.map((step, i) => {
            return (
              <WizardStep
                id={i}
                key={i}
                name={step.name}
                isDisabled={step.isDisabled}
                navItem={step.customNav}
                footer={step.customFooter}
              >
                {step.component}
              </WizardStep>
            );
          })}
        </Wizard>
      )}
      {isConfirmClose && confirmCloseBody}
      <ModalFooter>
        {isConfirmClose ? (
          <ConfirmCloseFooter
            onClose={onClose}
            returnToWizard={returnToWizard}
          />
        ) : undefined}
      </ModalFooter>
    </Modal>
  );
};

ConfirmCloseFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnToWizard: PropTypes.func.isRequired,
};

ActivationKeyWizard.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  activationKey: PropTypes.object,
  handleModalToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  CustomSuccessPage: PropTypes.node,
};

export default ActivationKeyWizard;
