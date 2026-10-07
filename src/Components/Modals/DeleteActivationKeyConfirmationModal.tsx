import * as React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Modal } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { ModalVariant } from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import useDeleteActivationKey from '../../hooks/useDeleteActivationKey';
import useNotifications from '../../hooks/useNotifications';
import Loading from '../LoadingState/Loading';
import { useQueryClient } from '@tanstack/react-query';
import type { ActivationKey } from '../../hooks/types';

export interface DeleteActivationKeyConfirmationModalProps {
  isOpen: boolean;
  handleModalToggle: (name: string, deleted: boolean) => void;
  name: string;
}

const DeleteActivationKeyConfirmationModal = (props: DeleteActivationKeyConfirmationModalProps) => {
  const { isOpen, handleModalToggle, name } = props;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { mutate, isPending } = useDeleteActivationKey();
  const queryClient = useQueryClient();

  const deleteActivationKey = (name: string) => {
    mutate(name, {
      onSuccess: (_data, name) => {
        queryClient.setQueryData<ActivationKey[]>(['activation_keys'], (oldData) =>
          oldData!.filter((entry) => entry.name != name)
        );
        addSuccessNotification(`Activation key ${name} deleted`);
        handleModalToggle(name, true);
      },
      onError: () => {
        addErrorNotification('Something went wrong. Please try again');
        handleModalToggle(name, false);
      }
    });
    mutate;
  };
  const actions = [
    <Button
      key="confirm"
      variant="danger"
      onClick={() => deleteActivationKey(name)}
      data-testid="delete-activation-key-confirmation-modal-confirm-button"
    >
      Delete
    </Button>,
    <Button key="cancel" variant="link" onClick={() => handleModalToggle(name, false)}>
      Cancel
    </Button>
  ];

  const title = (
    <>
      <Content>
        <Content component={ContentVariants.h2}>
          <ExclamationTriangleIcon color="#F0AB00" /> Delete activation key?
        </Content>
      </Content>
    </>
  );
  const content = () => {
    if (isPending) {
      return <Loading />;
    } else {
      return (
        <Content>
          <Content component={ContentVariants.p}>
            <b>{name}</b> will no longer be available for use. This operation cannot be undone.
          </Content>
        </Content>
      );
    }
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={() => handleModalToggle(name, false)}
      variant={ModalVariant.small}
      actions={actions}
    >
      {content()}
    </Modal>
  );
};

export default DeleteActivationKeyConfirmationModal;
