import React, { useState } from 'react';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { TextArea } from '@patternfly/react-core/dist/dynamic/components/TextArea';

export interface ActivationKeyDescriptionProps {
  isEditMode: boolean;
  description?: string;
  setDescription: (value: string) => void;
  descriptionIsValid: boolean;
}

const ActivationKeyDescription = ({
  isEditMode,
  description,
  setDescription,
  descriptionIsValid
}: ActivationKeyDescriptionProps) => {
  const [enableValidationFeedback, setEnableValidationFeedback] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleBlur = () => {
    setEnableValidationFeedback(true);
  };
  const helperText = 'Max characters is 255.';
  const validated = descriptionIsValid || !enableValidationFeedback ? 'default' : 'error';
  const helperTextInvalid = `Description requirements have not been met. ${helperText}`;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormGroup
        label={isEditMode ? 'Edit Description' : 'Description'}
        fieldId="activation-key-description"
      >
        <TextArea
          id={isEditMode ? 'edit-activation-key-description' : 'activation-key-description'}
          value={description}
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

export default ActivationKeyDescription;
