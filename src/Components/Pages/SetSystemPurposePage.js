import React, { useEffect } from 'react';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { Form } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import PropTypes from 'prop-types';
import Loading from '../LoadingState/Loading';

const SetSystemPurposePage = ({
  isEditMode,
  activationKey,
  role,
  setRole,
  sla,
  setSla,
  usage,
  setUsage,
  data,
  isLoading,
  isError,
}) => {
  useEffect(() => {
    setRole(activationKey?.role || '');
    setSla(activationKey?.serviceLevel || '');
    setUsage(activationKey?.usage || '');
  }, [activationKey, setRole, setSla, setUsage]);
  const Options = ({ options }) => (
    <>
      {options?.map((option) => (
        <FormSelectOption key={option} value={option} label={option} />
      ))}
    </>
  );
  Options.propTypes = {
    options: PropTypes.array.isRequired,
  };
  const Placeholder = () => (
    <FormSelectOption label="Not defined" isPlaceholder />
  );
  if (isLoading) return <Loading />;
  if (isError) return null;
  return (
    <>
      <Title headingLevel="h2" className="pf-v6-u-mb-sm">
        {isEditMode ? 'Edit system purpose' : 'Select system purpose'}{' '}
      </Title>
      <Content component={ContentVariants.p} className="pf-v6-u-mb-xl">
        System purpose values are used by the subscriptions service to help
        filter and identify hosts. Setting values for these attributes is an
        optional step, but doing so ensures that subscriptions reporting
        accurately reflects the system. Only those values available to your
        account are shown.
      </Content>
      <Form>
        <FormGroup
          label="Role"
          className="pf-v6-u-mb-sm"
          fieldId="activation-key-role"
        >
          <FormSelect
            onChange={(_event, value) => setRole(value)}
            value={role}
            id="activation-key-role"
          >
            <Options options={data.roles} />
            <Placeholder />
          </FormSelect>
        </FormGroup>
        <FormGroup
          label="Service level agreement (SLA)"
          className="pf-v6-u-mb-sm"
          fieldId="activation-key-sla"
        >
          <FormSelect
            onChange={(_event, value) => setSla(value)}
            value={sla}
            id="activation-key-sla"
          >
            <Options options={data.serviceLevel} />
            <Placeholder />
          </FormSelect>
        </FormGroup>
        <FormGroup
          label="Usage"
          className="pf-v6-u-mb-sm"
          fieldId="activation-key-usage"
        >
          <FormSelect
            onChange={(_event, value) => setUsage(value)}
            value={usage}
            id="activation-key-usage"
          >
            <Options options={data.usage} />
            <Placeholder />
          </FormSelect>
        </FormGroup>
      </Form>
    </>
  );
};

SetSystemPurposePage.propTypes = {
  isEditMode: PropTypes.bool,
  activationKey: PropTypes.object,
  role: PropTypes.string.isRequired,
  setRole: PropTypes.func.isRequired,
  sla: PropTypes.string.isRequired,
  setSla: PropTypes.func.isRequired,
  usage: PropTypes.string.isRequired,
  setUsage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    roles: PropTypes.array.isRequired,
    serviceLevel: PropTypes.array,
    usage: PropTypes.array,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool,
};
export default SetSystemPurposePage;
