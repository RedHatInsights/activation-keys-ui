import React, { useState } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Wizard } from '@patternfly/react-core/deprecated';
import PropTypes from 'prop-types';
import useUpdateActivationKey from '../../hooks/useUpdateActivationKey';
import useSystemPurposeAttributes from '../../hooks/useSystemPurposeAttributes';
import useNotifications from '../../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import EditWorkloadPage from '../Pages/EditWorkloadPage';
import SuccessPage from '../Pages/SuccessPage';
import EditNameAndDescriptionPage from '../Pages/EditNameandDescriptionPage';
import EditSystemPurposePage from '../Pages/EditSystemPurposePage';
import ReviewUpdatesPage from '../Pages/ReviewUpdatesPage';

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

const descriptionValidator = (description) => {
  const trimmedDescription = description.trim();
  return (
    description === '' ||
    (trimmedDescription.length > 0 && trimmedDescription.length <= 255)
  );
};

const EditActivationKeyWizard = ({
  activationKey,
  releaseVersions,
  handleModalToggle,
  isOpen,
  CustomSuccessPage,
}) => {
  const queryClient = useQueryClient();
  const {
    mutate: updateActivationKey,
    isLoading: updateActivationKeyIsLoading,
  } = useUpdateActivationKey();

  const {
    isLoading: attributesAreLoading,
    error,
    data,
  } = useSystemPurposeAttributes();
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [description, setDescription] = useState(
    activationKey?.description || ''
  );
  const [workload, setWorkload] = useState(workloadOptions[0]);
  const [extendedReleaseProduct, setExtendedReleaseProduct] = useState('');
  const [extendedReleaseVersion, setExtendedReleaseVersion] = useState(
    activationKey?.releaseVersion || ''
  );
  const [role, setRole] = useState(activationKey?.role);
  const [sla, setSla] = useState(activationKey?.serviceLevel);
  const [usage, setUsage] = useState(activationKey?.usage);
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [shouldConfirmClose, setShouldConfirmClose] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const descriptionIsValid = descriptionValidator(description || '');

  const onClose = () => {
    queryClient.invalidateQueries(['activation_keys'], {
      refetchActive: true,
    });
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

  const steps = [
    {
      id: 0,
      name: 'Name and Description',
      component: (
        <EditNameAndDescriptionPage
          activationKey={activationKey}
          name={activationKey?.name}
          description={description}
          setDescription={setDescription}
          descriptionIsValid={descriptionIsValid}
          isNameDisabled={true}
        />
      ),
      enableNext: descriptionIsValid,
    },
    {
      id: 1,
      name: 'Workload',
      component: (
        <EditWorkloadPage
          activationKey={activationKey}
          workloadOptions={workloadOptions}
          workload={workload}
          setWorkload={setWorkload}
          extendedReleaseProduct={extendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
          releaseVersions={releaseVersions}
          setExtendedReleaseProduct={setExtendedReleaseProduct}
          setExtendedReleaseVersion={setExtendedReleaseVersion}
        />
      ),
    },
    {
      id: 2,
      name: 'System purpose',
      component: (
        <EditSystemPurposePage
          data={data}
          activationKey={activationKey}
          roles={role}
          setRole={setRole}
          sla={sla}
          setSla={setSla}
          usage={usage}
          setUsage={setUsage}
          isError={error}
          isLoading={attributesAreLoading}
        />
      ),
    },
    {
      id: 3,
      name: 'Review',
      component: (
        <ReviewUpdatesPage
          activationKey={activationKey}
          name={activationKey?.name}
          description={description}
          workload={workload}
          role={role}
          sla={sla}
          usage={usage}
          isLoading={updateActivationKeyIsLoading}
          extendedReleaseProduct={extendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
        />
      ),
      nextButtonText: 'Update',
    },
    {
      id: 4,
      name: 'Finish',
      component: CustomSuccessPage ? (
        <CustomSuccessPage
          isLoading={updateActivationKeyIsLoading}
          name={activationKey?.name}
          onClose={onClose}
        />
      ) : (
        <SuccessPage
          isLoading={updateActivationKeyIsLoading}
          name={activationKey?.name}
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
      aria-label="Edit activation key wizard"
      onClose={isConfirmClose ? returnToWizard : undefined}
    >
      {!isConfirmClose && (
        <Wizard
          title="Edit activation key"
          steps={steps}
          height={400}
          navAriaLabel="Edit activation key steps"
          mainAriaLabel="Edit activation key content"
          onCurrentStepChanged={(step) => {
            setShouldConfirmClose(step.id > 0 && step.id < 4);
            setCurrentStep(step.id);
            if (step.id == 4) {
              updateActivationKey(
                {
                  activationKeyName: activationKey.name,
                  description,
                  role,
                  serviceLevel: sla,
                  usage,
                  releaseVersion: extendedReleaseVersion,
                },
                {
                  onSuccess: (updatedData) => {
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
                    addSuccessNotification(
                      `Changes saved for activation key "${activationKey.name}"`
                    );
                    queryClient.resetQueries([
                      `activation_key_${activationKey.name}`,
                    ]);
                  },
                  onError: () => {
                    addErrorNotification(
                      `Error updating activation key ${activationKey.name}.`
                    );
                    onClose();
                  },
                }
              );
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

EditActivationKeyWizard.propTypes = {
  name: PropTypes.string,
  handleModalToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  activationKey: PropTypes.object,
  CustomSuccessPage: PropTypes.node,
  releaseVersions: PropTypes.array,
};

export default EditActivationKeyWizard;
