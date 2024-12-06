import React from 'react';
import PropTypes from 'prop-types';
import SetNamePage from './SetNamePage';
import ActivationKeyDescription from '../ActivationKey/ActivationKeyDescription';

const SetNameAndDescriptionPage = ({
  name,
  setName,
  nameIsValid,
  description,
  setDescription,
  descriptionIsValid,
}) => {
  return (
    <div className="pf-l-grid pf-m-gutter">
      <div className="pf-v5-u-mb-xl">
        <SetNamePage name={name} setName={setName} nameIsValid={nameIsValid} />
      </div>
      <div className="pf-v5-u-mb-xl">
        <div className="pf-v6-u-text-wrap">
          <ActivationKeyDescription
            description={description}
            setDescription={setDescription}
            descriptionIsValid={descriptionIsValid}
          />
        </div>
      </div>
    </div>
  );
};

SetNameAndDescriptionPage.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  nameIsValid: PropTypes.bool.isRequired,
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
};

export default SetNameAndDescriptionPage;
