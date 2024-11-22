import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Text,
  TextInput,
  TextVariants,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Form,
  TextArea,
  TextContent,
} from '@patternfly/react-core';

const SetDescriptionPage = ({
  description,
  setDescription,
  descriptionIsValid,
}) => {
  const [enableValidationFeedback, setEnableValidationFeedback] =
    useState(false);

  const helperText =
    'Provide a brief description for the activation key. Max characters is 225.';
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

SetDescriptionPage.propTypes = {
  description: PropTypes.string,
  setDescription: PropTypes.func.isRequired,
  descriptionIsValid: PropTypes.bool.isRequired,
};

export default SetDescriptionPage;
