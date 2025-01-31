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
  mode,
  description,
  setDescription,
  descriptionIsValid,
}) => {
  const [enableValidationFeedback, setEnableValidationFeedback] =
    useState(false);
  const [localDescription, setLocalDescription] = useState(description);
  const handleChange = (event) => {
    if (mode === 'edit') {
      setLocalDescription(event.target.value);
    } else {
      setDescription(event.target.value);
    }
  };
  const handleBlur = () => {
    setEnableValidationFeedback(true);
    if (mode === 'edit') {
      setDescription(localDescription);
    }
  };
  const helperText = 'Max characters is 255.';
  const validated =
    descriptionIsValid || !enableValidationFeedback ? 'default' : 'error';
  const helperTextInvalid = `Description requirements have not been met. ${helperText}`;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormGroup
        label={mode === 'edit' ? 'Edit Description' : 'Description'}
        fieldId="activation-key-description"
      >
        <TextArea
          id={
            mode === 'edit'
              ? 'edit-activation-key-description'
              : 'activation-key-description'
          }
          value={mode === 'edit' ? localDescription : description}
          onChange={handleChange}
          validated={validated}
          onBlur={handleBlur}
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
  );
};
ActivationKeyDescription.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
};
export default ActivationKeyDescription;
