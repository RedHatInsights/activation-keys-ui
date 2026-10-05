import React from 'react';
import { WriteOnlyButton } from '../WriteOnlyButton';
import MinusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/minus-circle-icon';

export interface RemoveAdditionalRepositoriesButtonProps {
  onClick: () => void;
}

const RemoveAdditionalRepositoriesButton = ({
  onClick
}: RemoveAdditionalRepositoriesButtonProps) => {
  return (
    <WriteOnlyButton
      onClick={onClick}
      enabledTooltip="Remove"
      disabledTooltip="For editing access, contact your administrator."
      variant="plain"
      aria-label="Action"
      icon={<MinusCircleIcon />}
    />
  );
};

export default RemoveAdditionalRepositoriesButton;
