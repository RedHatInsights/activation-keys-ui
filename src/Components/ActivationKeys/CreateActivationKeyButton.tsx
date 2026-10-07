import React from 'react';
import { WriteOnlyButton } from '../WriteOnlyButton';

export interface CreateActivationKeyButtonProps {
  onClick: () => void;
}

const CreateActivationKeyButton = ({ onClick }: CreateActivationKeyButtonProps) => {
  return (
    <WriteOnlyButton variant="primary" onClick={onClick}>
      Create activation key
    </WriteOnlyButton>
  );
};

export default CreateActivationKeyButton;
