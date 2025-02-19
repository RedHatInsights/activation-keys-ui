import React, { useState, useEffect } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { Wizard } from '@patternfly/react-core/deprecated';
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
const workloadOptions = ['Latest release', 'Extended support releases'];
const confirmCloseTitle = 'Exit activation key creation?';
const confirmCloseBody = <p>All inputs will be discarded.</p>;
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
  releaseVersions,
  handleModalToggle,
  isOpen,
}) => {
  const queryClient = useQueryClient();
  const {
    mutate: createActivationKey,
    isLoading: createActivationKeyIsLoading,
  } = useCreateActivationKey();
  const {
    mutate: updateActivationKey,
    isLoading: updateActivationKeyIsLoading,
  } = useUpdateActivationKey();
  const {
    isLoading: attributesAreLoading,
    error,
    data,
  } = useSystemPurposeAttributes();
  const { data: activationKeys } = useActivationKeys();
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [name, setName] = useState('');
  const [description, setDescription] = useState(
    activationKey?.description || ''
  );
  const [extendedReleaseProduct, setExtendedReleaseProduct] = useState('');
  const [extendedReleaseVersion, setExtendedReleaseVersion] = useState('');
  const [extendedReleaseRepositories, setExtendedReleaseRepositories] =
    useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [role, setRole] = useState(activationKey?.role);
  const [sla, setSla] = useState(activationKey?.serviceLevel);
  const [usage, setUsage] = useState(activationKey?.usage);
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [shouldConfirmClose, setShouldConfirmClose] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workload, setWorkload] = useState(() =>
    isEditMode && activationKey?.releaseVersion
      ? 'Extended support releases'
      : 'Latest release'
  );
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
  const handleWorkloadChange = (newValue) => {
    setWorkload(newValue);
  };
  const mode = isEditMode ? 'Edit' : 'Create';
  const steps = [
    {
      id: 0,
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
      enableNext: isEditMode
        ? descriptionIsValid
        : nameIsValid && descriptionIsValid,
    },
    {
      id: 1,
      name: 'Workload',
      component: (
        <SetWorkloadPage
          activationKey={activationKey}
          isEditMode={isEditMode}
          workloadOptions={workloadOptions}
          releaseVersions={releaseVersions || []}
          workload={workload}
          setWorkload={handleWorkloadChange}
          extendedReleaseProduct={extendedReleaseProduct}
          setExtendedReleaseProduct={setExtendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
          setExtendedReleaseVersion={setExtendedReleaseVersion}
          setExtendedReleaseRepositories={setExtendedReleaseRepositories}
        />
      ),
      isDisabled: !isEditMode && !nameIsValid,
    },
    {
      id: 2,
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
      id: 3,
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
      nextButtonText: isEditMode ? 'Update' : 'Create',
    },
    {
      id: 4,
      name: 'Finish',
      component: (
        <SuccessPage
          isLoading={
            createActivationKeyIsLoading ||
            updateActivationKeyIsLoading ||
            isMutationLoading
          }
          name={activationKey?.name}
          onClose={onClose}
          isEditMode={isEditMode}
        />
      ),
      isFinishedStep: true,
    },
  ];

  return (
    <Modal
      variant={isConfirmClose ? ModalVariant.small : ModalVariant.large}
      isOpen={isOpen}
      showClose={isConfirmClose}
      title={isConfirmClose ? confirmCloseTitle : undefined}
      titleIconVariant={isConfirmClose ? 'warning' : undefined}
      footer={
        isConfirmClose ? (
          <ConfirmCloseFooter
            onClose={onClose}
            returnToWizard={returnToWizard}
          />
        ) : undefined
      }
      hasNoBodyWrapper={!isConfirmClose}
      aria-label={
        isEditMode
          ? 'Edit activation key wizard'
          : 'Create activation key wizard'
      }
      onClose={isConfirmClose ? returnToWizard : undefined}
    >
      {!isConfirmClose && (
        <Wizard
          title={isEditMode ? 'Edit activation key' : 'Create activation key '}
          steps={steps}
          height={400}
          navAriaLabel={`${mode} activation key steps`}
          mainAriaLabel={`${mode} activation key content`}
          onCurrentStepChanged={(step) => {
            setShouldConfirmClose(step.id > 0 && step.id < 4);
            setCurrentStep(step.id);
            if (step.id === 4) {
              setIsMutationLoading(true);
              setIsSuccess(false);
              setIsError(isError);
              const mutationFn = isEditMode
                ? updateActivationKey
                : createActivationKey;
              const mutationData = isEditMode
                ? {
                    activationKeyName: activationKey.name,
                    description,
                    role,
                    serviceLevel: sla,
                    usage,
                    releaseVersion: extendedReleaseVersion,
                  }
                : {
                    name,
                    description,
                    role,
                    serviceLevel: sla,
                    usage,
                    additionalRepositories: workload.includes('Extended')
                      ? extendedReleaseRepositories
                      : undefined,
                    releaseVersion: extendedReleaseVersion,
                  };
              mutationFn(mutationData, {
                onSuccess: (updatedData) => {
                  setIsMutationLoading(isMutationLoading);
                  setIsSuccess(!isSuccess);
                  setIsError(isError);
                  if (isEditMode) {
                    queryClient.invalidateQueries([
                      `activation_key_${activationKey.name}`,
                    ]);
                    setDescription(updatedData.description);
                    addSuccessNotification(
                      `Changes saved for activation key "${activationKey.name}"`
                    );
                  } else {
                    addSuccessNotification(`Activation key "${name}" created`);
                  }
                  setCurrentStep(4);
                },
                onError: () => {
                  setIsMutationLoading(isMutationLoading);
                  setIsError(!isError);
                  setIsSuccess(isSuccess);
                  addErrorNotification(
                    isEditMode
                      ? `Error updating activation key ${activationKey.name}.`
                      : 'Something went wrong.'
                  );
                  handleModalToggle();
                },
              });
            }
          }}
          startAtStep={currentStep + 1}
          onClose={() => confirmClose(onClose)}
        />
      )}
      {isConfirmClose && confirmCloseBody}
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
  releaseVersions: PropTypes.array,
};

export default ActivationKeyWizard;
