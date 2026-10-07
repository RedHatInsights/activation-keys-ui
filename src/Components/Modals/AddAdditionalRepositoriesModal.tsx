import React, { useState } from 'react';
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
import type { AvailableRepository } from '../../hooks/types';

export interface AddAdditionalRepositoriesModalProps {
  keyName: string;
  handleModalToggle: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  error?: boolean;
}

const AddAdditionalRepositoriesModal = (props: AddAdditionalRepositoriesModalProps) => {
  const {
    keyName,
    handleModalToggle: parentHandleModalToggle,
    isOpen,
    error: additionalRepositoriesError
  } = props;
  const queryClient = useQueryClient();
  const [selectedRepositories, setSelectedRepositories] = useState<AvailableRepository[]>([]);
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { mutate, isPending: isSubmitting } = useAddAdditionalRepositories();
  const handleModalToggle = () => {
    setSelectedRepositories([]);
    parentHandleModalToggle();
  };

  const submitForm = () => {
    mutate(
      { selectedRepositories, keyName },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [`activation_key_${keyName}`]
          });
          queryClient.invalidateQueries({
            queryKey: [`activation_key_${keyName}_available_repositories`]
          });
          addSuccessNotification(`Repositories have been added for '${keyName}'`);
          handleModalToggle();
        },
        onError: () => {
          addErrorNotification('Something went wrong', {
            description: 'Your repositories could not be added. Please try again.'
          });
        }
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
      <Button key="cancel" variant="link" onClick={handleModalToggle} isDisabled={isSubmitting}>
        Cancel
      </Button>
    </ActionGroup>
  );

  const onClose = isSubmitting || additionalRepositoriesError ? undefined : handleModalToggle;

  return (
    <React.Fragment>
      <Modal variant={ModalVariant.large} isOpen={isOpen} onClose={onClose}>
        <ModalHeader title="Add repositories" description={editAdditionalRepositoriesDescription} />
        <ModalBody>
          <AddAdditionalRepositoriesTable
            keyName={keyName}
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

export default AddAdditionalRepositoriesModal;
