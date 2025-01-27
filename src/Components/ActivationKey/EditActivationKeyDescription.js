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

const EditActivationKeyDescription = ({
  description,
  onDescriptionChange,
  // setDescription,
  descriptionIsValid,
}) => {
  const [enableValidationFeedback, setEnableValidationFeedback] =
    useState(false);
  const [localDescription, setLocalDescription] = useState(description);

  const handleChange = (event) => {
    setLocalDescription(event.target.value);
  };

  const handleBlur = () => {
    onDescriptionChange(localDescription);
  };
  const helperText = 'Max characters is 255.';
  const validated =
    descriptionIsValid || !enableValidationFeedback ? 'default' : 'error';
  const helperTextInvalid = `Description requirements have not been met. ${helperText}`;
  console.log('I am a description', description);

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup
          label=" Edit Description"
          fieldId="activation-key-description"
        >
          <TextArea
            id="edit-activation-key-description"
            value={localDescription}
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
    </>
  );
};

EditActivationKeyDescription.propTypes = {
  description: PropTypes.string,
  onDescriptionChange: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
};

export default EditActivationKeyDescription;
