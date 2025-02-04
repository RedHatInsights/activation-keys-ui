import React from 'react';
import PropTypes from 'prop-types';
import SetNamePage from './SetNamePage';
import ActivationKeyDescription from '../ActivationKey/ActivationKeyDescription';

const NameAndDescriptionPage = ({
  mode,
  name,
  setName,
  nameIsValid,
  description,
  setDescription,
  descriptionIsValid,
  isNameDisabled,
}) => {
  return (
    <div className="pf-l-grid pf-m-gutter">
      <div className="pf-v5-u-mb-xl">
        <SetNamePage
          mode={mode}
          name={name}
          setName={setName}
          nameIsValid={nameIsValid}
          isNameDisabled={isNameDisabled}
        />
      </div>
      <div className="pf-v5-u-mb-xl">
        <div className="pf-v6-u-text-wrap">
          <ActivationKeyDescription
            mode={mode}
            description={description}
            setDescription={setDescription}
            descriptionIsValid={descriptionIsValid}
          />
        </div>
      </div>
    </div>
  );
};

NameAndDescriptionPage.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  name: PropTypes.string.isRequired,
  activationKey: PropTypes.object.isRequired,
  setName: PropTypes.func.isRequired,
  nameIsValid: PropTypes.bool.isRequired,
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
  isNameDisabled: PropTypes.bool.isRequired,
};
export default NameAndDescriptionPage;
