import React, { useState } from 'react';
import propTypes from 'prop-types';
import ActivationKeyWizard from '../Modals/ActivationKeyWizard';

const EditButton = ({ activationKey, releaseVersions }) => {
  const [isEditActivationKeyWizardOpen, setIsEditActivationKeyWizardOpen] =
    useState(false);

  const handleEditActivationKeyWizardToggle = () => {
    setIsEditActivationKeyWizardOpen(!isEditActivationKeyWizardOpen);
  };

  return (
    <>
      <button onClick={handleEditActivationKeyWizardToggle}>Edit</button>
      <ActivationKeyWizard
        activationKey={activationKey}
        handleModalToggle={handleEditActivationKeyWizardToggle}
        isOpen={isEditActivationKeyWizardOpen}
        releaseVersions={releaseVersions}
      />
    </>
  );
};

EditButton.propTypes = {
  activationKey: propTypes.object,
  releaseVersions: propTypes.array,
};

export default EditButton;
