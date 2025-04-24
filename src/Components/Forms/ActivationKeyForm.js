import React, { useEffect, useState } from 'react';
import { ActionGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import HelpIcon from '@patternfly/react-icons/dist/dynamic/icons/help-icon';
import useSystemPurposeAttributes from '../../hooks/useSystemPurposeAttributes';
import ActivationKeysFormSelect from './ActivationKeysFormSelect';
import PropTypes from 'prop-types';
import useNotifications from '../../hooks/useNotifications';

const ActivationKeyForm = (props) => {
  const { handleModalToggle, submitForm, isSuccess, isError, activationKey } =
    props;
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const { isLoading, error, data } = useSystemPurposeAttributes();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [serviceLevel, setServiceLevel] = useState('');
  const [usage, setUsage] = useState('');
  const [validated, setValidated] = useState('default');
  const nameRegex = '^[a-zA-Z0-9-_]*$';
  const validationText =
    'Provide a name to be used when registering the activation key. Your activation key name must be unique, may contain only numbers, letters, underscores, and hyphens, and less than 256 characters.';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validated === 'success' || activationKey) {
      submitForm({
        name: name,
        role: role,
        serviceLevel: serviceLevel,
        usage: usage,
      });
    } else {
      setValidated('error');
    }
  };

  const validateName = (value) => {
    if (value.length === 0 || value.length > 255) {
      setValidated('error');
    } else if (!value.match(nameRegex)) {
      setValidated('error');
    } else {
      setValidated('success');
      setName(value);
    }
  };

  useEffect(() => {
    if (activationKey) {
      setRole(activationKey.role);
      setUsage(activationKey.usage);
      setServiceLevel(activationKey.serviceLevel);
    }
  }, [activationKey]);

  const createButtonDisabled = () => {
    if (activationKey) {
      return (
        activationKey.role === role &&
        activationKey.serviceLevel === serviceLevel &&
        activationKey.usage === usage
      );
    } else {
      return (
        validated === 'error' || name.length === 0 || !name.match(nameRegex)
      );
    }
  };

  if (isSuccess) {
    const successMessage = activationKey
      ? `Activation key ${activationKey.name} updated successfully.`
      : 'Activation key created successfully.';
    addSuccessNotification(successMessage, {
      timeout: false,
    });
    handleModalToggle();
  } else if (isError) {
    const errorMessage = activationKey
      ? `Error updating activation key ${activationKey.name}.`
      : 'Activation Key was not created, please try again.';
    addErrorNotification(errorMessage, {
      timeout: 8000,
    });
    handleModalToggle();
  }

  return (
    <Form id="activation-key-form" onSubmit={handleSubmit}>
      {!activationKey && (
        <FormGroup label="Name" isRequired>
          <TextInput
            id="activation-key-name"
            label="Name"
            isRequired
            type="text"
            validated={validated}
            onChange={(_event, value) => validateName(value)}
            name="name"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant={validated}>
                {validationText}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      )}
      {activationKey && (
        <FormGroup label="Name">
          {' '}
          <Content>{activationKey.name}</Content>
        </FormGroup>
      )}
      {!isLoading && !error && (
        <ActivationKeysFormSelect
          data={data.roles}
          value={role}
          onSelect={setRole}
          label="Role"
          name="role"
          placeholderValue="Select role"
          disableDefaultValues={activationKey ? true : false}
          popover={
            <Popover
              bodyContent={
                <Content>
                  <Content component={ContentVariants.p}>
                    Role is used to categorize systems by the workload on the
                    system
                  </Content>
                  <Content component={ContentVariants.p}>
                    Subscription Watch can help you filter and report by these
                    items.
                  </Content>
                  <Content component={ContentVariants.p}>
                    Only roles available to your account are shown.
                  </Content>
                </Content>
              }
            >
              <HelpIcon />
            </Popover>
          }
          helperText="Select the required role from the list. The list only contains roles available to the activation key."
        />
      )}
      {!isLoading && !error && (
        <ActivationKeysFormSelect
          data={data.serviceLevel}
          value={serviceLevel}
          onSelect={setServiceLevel}
          label="Service Level Agreement (SLA)"
          name="serviceLevel"
          placeholderValue="Select a service level agreement"
          disableDefaultValues={activationKey ? true : false}
          popover={
            <Popover
              bodyContent={
                <Content>
                  <Content component={ContentVariants.p}>
                    Service Level Agreement (SLA) determines the level of
                    support for systems registered with this activation key.
                  </Content>
                </Content>
              }
            >
              <HelpIcon />
            </Popover>
          }
          helperText="Select the required service level from the list. The list only contains service levels available to the activation key."
        />
      )}
      {!isLoading && !error && (
        <ActivationKeysFormSelect
          data={data.usage}
          value={usage}
          onSelect={setUsage}
          label="Usage"
          name="usage"
          placeholderValue="Select usage"
          disableDefaultValues={activationKey ? true : false}
          popover={
            <Popover
              bodyContent={
                <Content>
                  <Content component={ContentVariants.p}>
                    Usage is used to categorize systems by how they are meant to
                    be used, and therefore supported.
                  </Content>
                  <Content component={ContentVariants.p}>
                    Subscription Watch can help you filter and report by these
                    items.
                  </Content>
                </Content>
              }
            >
              <HelpIcon />
            </Popover>
          }
          helperText="Select the required usage from the list. The list only contains usages available to the activation key."
        />
      )}
      <ActionGroup>
        <Button
          key="create"
          id="submit-activation-key-button"
          variant="primary"
          type="submit"
          isDisabled={createButtonDisabled()}
          data-testid="activation-key-submit-button"
        >
          {activationKey ? 'Save changes' : 'Create'}
        </Button>

        <Button
          key="cancel"
          id="cancel-activation-key-button"
          variant="link"
          onClick={handleModalToggle}
        >
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

ActivationKeyForm.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool,
  isError: PropTypes.bool,
  activationKey: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default ActivationKeyForm;
