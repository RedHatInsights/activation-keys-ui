import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Form,
  TextArea,
} from '@patternfly/react-core';

const ActivationKeyDescription = ({
  description,
  setDescription,
  descriptionIsValid,
}) => {
  const [enableValidationFeedback, setEnableValidationFeedback] =
    useState(false);

  const helperText = 'Max characters is 225.';
  const validated =
    descriptionIsValid || !enableValidationFeedback ? 'default' : 'error';
  const helperTextInvalid = `Description requirements have not been met. ${helperText}`;

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup label="Description" fieldId="activation-key-description">
          <TextArea
            id="activation-key-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            validated={validated}
            onBlur={() => setEnableValidationFeedback(true)}
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant={validated}>
                {validated === 'default' ? helperText : helperTextInvalid}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </Form>
    </>
  );
};

ActivationKeyDescription.propTypes = {
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
};

export default ActivationKeyDescription;
