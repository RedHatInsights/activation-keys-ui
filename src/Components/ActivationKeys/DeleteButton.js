import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteActivationKeyConfirmationModal from '../Modals/DeleteActivationKeyConfirmationModal';

const DeleteButton = () => {
  const [isDeleteActivationKeyWizardOpen, setIsDeleteActivationKeyWizardOpen] =
    useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleDeleteActivationKeyWizardToggle = (keyDeleted) => {
    setIsDeleteActivationKeyWizardOpen(!isDeleteActivationKeyWizardOpen);
    if (keyDeleted == true) {
      navigate('..');
    }
  };

  return (
    <>
      <button onClick={handleDeleteActivationKeyWizardToggle}>Edit</button>
      <DeleteActivationKeyConfirmationModal
        handleModalToggle={handleDeleteActivationKeyWizardToggle}
        isOpen={isDeleteActivationKeyWizardOpen}
        name={id}
      />
    </>
  );
};

DeleteButton.propTypes = {
  activationKey: propTypes.object,
  releaseVersions: propTypes.array,
};

export default DeleteButton;
