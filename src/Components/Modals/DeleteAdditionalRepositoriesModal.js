import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Modal } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import propTypes from 'prop-types';
import useNotifications from '../../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import useDeleteAdditionalRepositories from '../../hooks/useDeleteAdditionalRepositories';

const DeleteAdditionalRepositoriesModal = (props) => {
  const {
    isOpen,
    handleModalToggle,
    name,
    repositoryNameToDelete,
    repositoryLabelToDelete,
  } = props;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { mutate, isLoading } = useDeleteAdditionalRepositories();
  const queryClient = useQueryClient();

  const deleteAdditionalRepositories = (
    name,
    repositoryNameToDelete,
    repositoryLabelToDelete
  ) => {
    const payload = [
      {
        repositoryLabel: repositoryLabelToDelete,
        repositoryName: repositoryNameToDelete,
      },
    ];

    mutate(
      { name, payload },
      {
        onSuccess: (data, queryName) => {
          const updatedData = data?.filter(
            (entry) => entry.repositoryName !== repositoryNameToDelete
          );
          addSuccessNotification(
            `Additional repository ${repositoryNameToDelete} deleted`
          );
          queryClient.invalidateQueries(queryName, updatedData);
          handleModalToggle();
        },
        onError: () => {
          addErrorNotification('Something went wrong. Please try again');
          handleModalToggle();
        },
      }
    );
  };

  const actions = [
    <Button
      key="confirm"
      variant="danger"
      isLoading={isLoading}
      onClick={() =>
        deleteAdditionalRepositories(
          name,
          repositoryNameToDelete,
          repositoryLabelToDelete
        )
      }
      isDisabled={isLoading}
      spinnerAriaValueText="Removing repository"
    >
      {isLoading ? 'Removing repository' : 'Remove repository'}
    </Button>,
    <Button
      key="cancel"
      variant="link"
      onClick={handleModalToggle}
      isDisabled={isLoading}
    >
      Cancel
    </Button>,
  ];

  const title = (
    <>
      <Content>
        <Content component={ContentVariants.h2}>
          <ExclamationTriangleIcon size="md" color="#F0AB00" />
          Remove repository?
        </Content>
      </Content>
    </>
  );

  const content = (
    <>
      <Content>
        <Content component={ContentVariants.p}>
          <b>{repositoryNameToDelete}</b> will no longer be enabled when
          registering with this activation key.
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
      isDisabled={isLoading}
    >
      {content}
    </Modal>
  );
};

DeleteAdditionalRepositoriesModal.propTypes = {
  isOpen: propTypes.bool.isRequired,
  handleModalToggle: propTypes.func.isRequired,
  repositoryNameToDelete: propTypes.string.isRequired,
  repositoryLabelToDelete: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
};

export default DeleteAdditionalRepositoriesModal;
