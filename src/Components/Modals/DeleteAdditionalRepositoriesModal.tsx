import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Modal } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import useNotifications from '../../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import useDeleteAdditionalRepositories from '../../hooks/useDeleteAdditionalRepositories';

export interface DeleteAdditionalRepositoriesModalProps {
  isOpen: boolean;
  handleModalToggle: () => void;
  repositoryNameToDelete?: string;
  repositoryLabelToDelete?: string;
  name: string;
}

const DeleteAdditionalRepositoriesModal = (props: DeleteAdditionalRepositoriesModalProps) => {
  const { isOpen, handleModalToggle, name, repositoryNameToDelete, repositoryLabelToDelete } =
    props;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { mutate, isPending } = useDeleteAdditionalRepositories();
  const queryClient = useQueryClient();

  const deleteAdditionalRepositories = (
    name: string,
    repositoryNameToDelete?: string,
    repositoryLabelToDelete?: string
  ) => {
    const payload = [
      {
        repositoryLabel: repositoryLabelToDelete as string,
        repositoryName: repositoryNameToDelete
      }
    ];

    mutate(
      { name, payload },
      {
        onSuccess: (_data, queryName) => {
          addSuccessNotification(`Additional repository ${repositoryNameToDelete} deleted`);
          queryClient.invalidateQueries({ queryKey: [queryName] });
          handleModalToggle();
        },
        onError: () => {
          addErrorNotification('Something went wrong. Please try again');
          handleModalToggle();
        }
      }
    );
  };

  const actions = [
    <Button
      key="confirm"
      variant="danger"
      isLoading={isPending}
      onClick={() =>
        deleteAdditionalRepositories(name, repositoryNameToDelete, repositoryLabelToDelete)
      }
      isDisabled={isPending}
      spinnerAriaValueText="Removing repository"
    >
      {isPending ? 'Removing repository' : 'Remove repository'}
    </Button>,
    <Button key="cancel" variant="link" onClick={handleModalToggle} isDisabled={isPending}>
      Cancel
    </Button>
  ];

  const title = (
    <>
      <Content>
        <Content component={ContentVariants.h2}>
          <ExclamationTriangleIcon color="#F0AB00" />
          Remove repository?
        </Content>
      </Content>
    </>
  );

  const content = (
    <>
      <Content>
        <Content component={ContentVariants.p}>
          <b>{repositoryNameToDelete}</b> will no longer be enabled when registering with this
          activation key.
        </Content>
      </Content>
    </>
  );

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={handleModalToggle}
      variant={ModalVariant.small}
      actions={actions}
    >
      {content}
    </Modal>
  );
};

export default DeleteAdditionalRepositoriesModal;
