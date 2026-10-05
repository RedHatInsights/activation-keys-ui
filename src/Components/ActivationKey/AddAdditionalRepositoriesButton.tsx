import React from 'react';
import { WriteOnlyButton } from '../WriteOnlyButton';

export interface AddAdditionalRepositoriesButtonProps {
  onClick: () => void;
}

const AddAdditionalRepositoriesButton = ({ onClick }: AddAdditionalRepositoriesButtonProps) => {
  return (
    <React.Fragment>
      <WriteOnlyButton onClick={onClick} variant="secondary" style={{ margin: 15, marginLeft: 0 }}>
        Add repositories
      </WriteOnlyButton>
    </React.Fragment>
  );
};

export default AddAdditionalRepositoriesButton;
