import React, { useState } from 'react';
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
  activationKey,
  releaseVersions,
  handleModalToggle,
  isOpen,
  CustomSuccessPage,
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
  const [workload, setWorkload] = useState(workloadOptions[0]);
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
  const keyNames = activationKeys?.map((key) => key.name) || [];
  const nameIsValid = nameValidator(name, keyNames);
  const isEditMode = activationKey !== undefined;
  const descriptionIsValid = descriptionValidator(description || '');

  const onClose = () => {
    queryClient.invalidateQueries(['activation_keys']);
    handleModalToggle();
  };

  const confirmClose = (onClose) => {
    if (shouldConfirmClose) {
      setIsConfirmClose(true);
    } else {
      onClose();
    }
  };

  const returnToWizard = () => {
    setIsConfirmClose(false);
  };
  console.log('Data:', data);

  console.log('Wizard loading state:', { attributesAreLoading });

  const steps = [
    {
      id: 0,
      name: 'Name and Description',
      component: (
        <NameAndDescriptionPage
          activationKey={activationKey}
          mode={isEditMode ? 'edit' : 'create'}
          name={activationKey?.name || name}
          setName={setName}
          nameIsValid={nameIsValid}
          description={description}
          setDescription={setDescription}
          isNameDisabled={isEditMode ? true : false}
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
          mode={isEditMode ? 'edit' : 'create'}
          workloadOptions={workloadOptions}
          releaseVersions={releaseVersions || []}
          workload={workload}
          setWorkload={setWorkload}
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
          mode={isEditMode ? 'edit' : 'create'}
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
          mode={isEditMode ? 'edit' : 'create'}
          activationKey={activationKey}
          name={name}
          description={description}
          workload={workload}
          role={role}
          sla={sla}
          usage={usage}
          isLoading={createActivationKeyIsLoading}
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
      component: CustomSuccessPage ? (
        <CustomSuccessPage
          isLoading={
            isEditMode
              ? updateActivationKeyIsLoading
              : createActivationKeyIsLoading
          }
          name={isEditMode ? activationKey?.name : name}
          onClose={onClose}
        />
      ) : (
        <SuccessPage
          isLoading={
            isEditMode
              ? updateActivationKeyIsLoading
              : createActivationKeyIsLoading
          }
          name={isEditMode ? activationKey?.name : name}
          onClose={onClose}
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
      aria-label="Create activation key wizard"
      onClose={isConfirmClose ? returnToWizard : undefined}
    >
      {!isConfirmClose && (
        <Wizard
          title={isEditMode ? 'Edit activation key' : 'Create activation key '}
          steps={steps}
          height={400}
          navAriaLabel={
            isEditMode
              ? 'Edit activation key steps'
              : 'Create activation key steps'
          }
          mainAriaLabel={
            isEditMode
              ? 'Edit activation key content'
              : 'Create activation key content '
          }
          onCurrentStepChanged={(step) => {
            setShouldConfirmClose(step.id > 0 && step.id < 4);
            setCurrentStep(step.id);
            if (step.id === 4) {
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
                  if (isEditMode) {
                    queryClient.invalidateQueries([
                      `activation_key_${activationKey.name}`,
                    ]);
                    queryClient.setQueryData([`activation_key`], (prev) => {
                      if (!prev) return prev;
                      return prev.map((key) =>
                        key.activationKeyName === activationKey.name
                          ? { ...key, description: updatedData.description }
                          : key
                      );
                    });
                    setDescription(updatedData.description);
                    queryClient.resetQueries([
                      `activation_key_${activationKey.name}`,
                    ]);
                    addSuccessNotification(
                      `Changes saved for activation key "${activationKey.name}"`
                    );
                  } else {
                    addSuccessNotification(`Activation key "${name}" created`);
                  }
                },
                onError: () => {
                  addErrorNotification(
                    isEditMode
                      ? `Error updating activation key ${activationKey.name}.`
                      : 'Something went wrong',
                    isEditMode
                      ? undefined
                      : {
                          description:
                            'Your changes could not be saved. Please try again.',
                        }
                  );
                  onClose();
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
  activationKey: PropTypes.object,
  handleModalToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  CustomSuccessPage: PropTypes.node,
  releaseVersions: PropTypes.array,
};

export default ActivationKeyWizard;
