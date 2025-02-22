import React, { useState } from 'react';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Wizard } from '@patternfly/react-core/deprecated';
import PropTypes from 'prop-types';
import useCreateActivationKey from '../../hooks/useCreateActivationKey';
import useSystemPurposeAttributes from '../../hooks/useSystemPurposeAttributes';
import useNotifications from '../../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import ReviewPage from '../Pages/ReviewPage';
import SetWorkloadPage from '../Pages/SetWorkLoadPage';
import SetSystemPurposePage from '../Pages/SetSystemPurposePage';
import SuccessPage from '../Pages/SuccessPage';
import useActivationKeys from '../../hooks/useActivationKeys';
import SetNameAndDescriptionPage from '../Pages/SetNameAndDescriptionPage';

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

const CreateActivationKeyWizard = ({
  handleModalToggle,
  isOpen,
  CustomSuccessPage,
}) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading: createActivationKeyIsLoading } =
    useCreateActivationKey();
  const {
    isLoading: attributesAreLoading,
    error,
    data,
  } = useSystemPurposeAttributes();
  const { data: activationKeys } = useActivationKeys();
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [name, setName] = useState('');
  const [description, setDescription] = useState();
  const [workload, setWorkload] = useState(workloadOptions[0]);
  const [extendedReleaseProduct, setExtendedReleaseProduct] = useState('');
  const [extendedReleaseVersion, setExtendedReleaseVersion] = useState('');
  const [extendedReleaseRepositories, setExtendedReleaseRepositories] =
    useState([]);
  const [role, setRole] = useState('');
  const [sla, setSla] = useState('');
  const [usage, setUsage] = useState('');
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [shouldConfirmClose, setShouldConfirmClose] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const keyNames = activationKeys?.map((key) => key.name) || [];
  const nameIsValid = nameValidator(name, keyNames);
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

  const steps = [
    {
      id: 0,
      name: 'Name and Description',
      component: (
        <SetNameAndDescriptionPage
          name={name}
          setName={setName}
          nameIsValid={nameIsValid}
          description={description}
          setDescription={setDescription}
          descriptionIsValid={descriptionIsValid}
        />
      ),
      enableNext: nameIsValid && descriptionIsValid,
    },
    {
      id: 1,
      name: 'Workload',
      component: (
        <SetWorkloadPage
          workloadOptions={workloadOptions}
          workload={workload}
          setWorkload={setWorkload}
          extendedReleaseProduct={extendedReleaseProduct}
          setExtendedReleaseProduct={setExtendedReleaseProduct}
          extendedReleaseVersion={extendedReleaseVersion}
          setExtendedReleaseVersion={setExtendedReleaseVersion}
          setExtendedReleaseRepositories={setExtendedReleaseRepositories}
        />
      ),
      isDisabled: !nameIsValid,
    },
    {
      id: 2,
      name: 'System purpose',
      component: (
        <SetSystemPurposePage
          role={role}
          setRole={setRole}
          data={data || []}
          sla={sla}
          setSla={setSla}
          usage={usage}
          setUsage={setUsage}
          isLoading={attributesAreLoading}
          isError={error}
        />
      ),
      isDisabled: !nameIsValid,
    },
    {
      id: 3,
      name: 'Review',
      component: (
        <ReviewPage
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
      isDisabled: !nameIsValid,
      nextButtonText: 'Create',
    },
    {
      id: 4,
      name: 'Finish',
      component: CustomSuccessPage ? (
        <CustomSuccessPage
          isLoading={createActivationKeyIsLoading}
          name={name}
          onClose={onClose}
        />
      ) : (
        <SuccessPage
          isLoading={createActivationKeyIsLoading}
          name={name}
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
          title="Create activation key"
          steps={steps}
          height={400}
          navAriaLabel="Create activation key steps"
          mainAriaLabel="Create activation key content"
          onCurrentStepChanged={(step) => {
            setShouldConfirmClose(step.id > 0 && step.id < 4);
            setCurrentStep(step.id);
            if (step.id == 4) {
              mutate(
                {
                  name,
                  description,
                  role,
                  serviceLevel: sla,
                  usage,
                  additionalRepositories: workload.includes('Extended')
                    ? extendedReleaseRepositories
                    : undefined,
                  releaseVersion: extendedReleaseVersion,
                },
                {
                  onSuccess: () => {
                    addSuccessNotification(`Activation key "${name}" created`);
                  },
                  onError: () => {
                    addErrorNotification('Something went wrong', {
                      description:
                        'Your changes could not be saved. Please try again.',
                    });
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

CreateActivationKeyWizard.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  CustomSuccessPage: PropTypes.node,
};

export default CreateActivationKeyWizard;
