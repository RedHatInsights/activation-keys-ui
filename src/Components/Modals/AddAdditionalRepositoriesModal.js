import React, { useState } from 'react';
import propTypes from 'prop-types';
import { ActionGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { useQueryClient } from '@tanstack/react-query';
import useAddAdditionalRepositories from '../../hooks/useAddAdditionalRepositories';
import useNotifications from '../../hooks/useNotifications';
import AddAdditionalRepositoriesTable from '../AddAdditionalRepositoriesTable';
import { ModalFooter } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalHeader } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { ModalBody } from '@patternfly/react-core/dist/dynamic/components/Modal';

const AddAdditionalRepositoriesModal = (props) => {
  const {
    keyName,
    handleModalToggle: parentHandleModalToggle,
    isOpen,
    repositories,
    isLoading: additionalRepositoriesAreLoading,
    error: additionalRepositoriesError,
  } = props;
  const queryClient = useQueryClient();
  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { mutate, isLoading: isSubmitting } = useAddAdditionalRepositories();
  const handleModalToggle = () => {
    setSelectedRepositories([]);
    parentHandleModalToggle();
  };

  const submitForm = () => {
    mutate(
      { selectedRepositories, keyName },
      {
        onSuccess: () => {
          queryClient.resetQueries([`activation_key_${keyName}`]);
          queryClient.resetQueries([
            `activation_key_${keyName}_available_repositories`,
          ]);
          addSuccessNotification(
            `Repositories have been added for '${keyName}'`
          );
        },
        onError: () => {
          addErrorNotification('Something went wrong', {
            description:
              'Your repositories could not be added. Please try again.',
          });
        },
      }
    );
  };

  const editAdditionalRepositoriesDescription =
    'The core repositories for your operating system version, for example BaseOS and AppStream, are always enabled and do not need to be explicitly added to the activation key.';
  const editChangesButtons = (
    <ActionGroup>
      <Button
        variant="primary"
        onClick={submitForm}
        isLoading={isSubmitting}
        isDisabled={isSubmitting || selectedRepositories.length === 0}
        spinnerAriaValueText="Saving Changes..."
      >
        {isSubmitting ? 'Saving Changes' : 'Save Changes'}
      </Button>
      <Button
        key="cancel"
        variant="link"
        onClick={handleModalToggle}
        isDisabled={isSubmitting}
      >
        Cancel
      </Button>
    </ActionGroup>
  );

  const onClose =
    isSubmitting || additionalRepositoriesError ? null : handleModalToggle;

  return (
    <React.Fragment>
      <Modal variant={ModalVariant.large} isOpen={isOpen} onClose={onClose}>
        <ModalHeader
          title="Add repositories"
          description={editAdditionalRepositoriesDescription}
        />
        <ModalBody>
          <AddAdditionalRepositoriesTable
            keyName={keyName}
            repositories={repositories}
            isLoading={additionalRepositoriesAreLoading}
            error={additionalRepositoriesError}
            selectedRepositories={selectedRepositories}
            setSelectedRepositories={setSelectedRepositories}
            isSubmitting={isSubmitting}
          />
        </ModalBody>
        <ModalFooter>{editChangesButtons}</ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

AddAdditionalRepositoriesModal.propTypes = {
  keyName: propTypes.string,
  handleModalToggle: propTypes.func.isRequired,
  isOpen: propTypes.bool.isRequired,
  repositories: propTypes.array,
  isLoading: propTypes.bool,
  error: propTypes.bool,
  buttonState: propTypes.bool,
};

export default AddAdditionalRepositoriesModal;
