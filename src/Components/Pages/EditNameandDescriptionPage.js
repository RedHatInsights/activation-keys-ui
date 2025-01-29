import React from 'react';
import PropTypes from 'prop-types';
import SetNamePage from './SetNamePage';
import EditActivationKeyDescription from '../ActivationKey/EditActivationKeyDescription';

const EditNameAndDescriptionPage = ({
  name,
  setName,
  nameIsValid,
  description,
  descriptionIsValid,
  setDescription,
  isNameDisabled,
}) => {
  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
  };
  return (
    <div className="pf-l-grid pf-m-gutter">
      <div className="pf-v5-u-mb-xl">
        <SetNamePage
          name={name}
          setName={setName}
          nameIsValid={nameIsValid}
          isNameDisabled={isNameDisabled}
        />
      </div>
      <div className="pf-v5-u-mb-xl">
        <div className="pf-v6-u-text-wrap">
          <EditActivationKeyDescription
            description={description}
            setDescription={setDescription}
            onDescriptionChange={handleDescriptionChange}
            descriptionIsValid={descriptionIsValid}
          />
        </div>
      </div>
    </div>
  );
};

EditNameAndDescriptionPage.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  nameIsValid: PropTypes.bool.isRequired,
  description: PropTypes.string,
  onDescriptionChange: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
  isNameDisabled: PropTypes.bool.isRequired,
};

export default EditNameAndDescriptionPage;
