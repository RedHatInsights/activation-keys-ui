import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';

const SetNamePage = ({ name, setName, nameIsValid, isNameDisabled }) => {
  const [enableValidationFeedback, setEnableValidationFeedback] =
    useState(false);

  const helperText =
    'Your activation key name must be unique and must contain only numbers, letters, underscores, and hyphens.';
  const validated =
    nameIsValid || !enableValidationFeedback ? 'default' : 'error';
  const helperTextInvalid = `Name requirements have not been met. ${helperText}`;

  return (
    <>
      <Title headingLevel="h2" className="pf-v5-u-mb-sm">
        Name key
      </Title>
      <Content component={ContentVariants.p} className="pf-v5-u-mb-xl">
        This name cannot be modified after the activation key is created.
      </Content>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormGroup label="Name" isRequired fieldId="activation-key-name">
          <TextInput
            id="activation-key-name"
            isRequired
            type="text"
            value={name || ''}
            onChange={(_event, name) => setName(name)}
            validated={validated}
            onBlur={() => setEnableValidationFeedback(true)}
            isDisabled={isNameDisabled}
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

SetNamePage.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  nameIsValid: PropTypes.bool.isRequired,
  isNameDisabled: PropTypes.bool.isRequired,
};

export default SetNamePage;
