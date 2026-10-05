import React from 'react';
import { WriteOnlyButton } from '../WriteOnlyButton';
import TrashIcon from '@patternfly/react-icons/dist/dynamic/icons/trash-icon';

export interface DeleteActivationKeyButtonProps {
  onClick: () => void;
}

const DeleteActivationKeyButton = ({ onClick }: DeleteActivationKeyButtonProps) => {
  return (
    <WriteOnlyButton
      variant="plain"
      onClick={onClick}
      disabledTooltip="For editing access, contact your administrator."
      enabledTooltip="Delete"
      icon={<TrashIcon />}
    />
  );
};

export default DeleteActivationKeyButton;
