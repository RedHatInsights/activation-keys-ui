import React, { type ReactElement, useState } from 'react';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';

export interface ActivationKeysFormSelectProps {
  label: string;
  popover?: ReactElement;
  helperText?: string;
  data: string[];
  onSelect: (value: string) => void;
  name?: string;
  placeholderValue?: string;
  value?: string;
  disableDefaultValues?: boolean;
}

const ActivationKeysFormSelect = (props: ActivationKeysFormSelectProps) => {
  const {
    label,
    popover,
    data,
    onSelect,
    helperText,
    name,
    value,
    placeholderValue,
    disableDefaultValues
  } = props;
  const [selected, setSelected] = useState('');
  const options = data.map((role) => {
    return <FormSelectOption key={role} value={role} label={role} />;
  });
  const valueChange = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <FormGroup label={label} labelHelp={popover}>
      <FormSelect
        onChange={(_event, value) => valueChange(value)}
        value={selected || value}
        name={name}
        aria-label={placeholderValue}
      >
        {options}
        <FormSelectOption
          label={placeholderValue ?? ''}
          isPlaceholder={true}
          isDisabled={disableDefaultValues}
        />
      </FormSelect>
      <FormHelperText>
        <HelperText>
          <HelperTextItem>{helperText}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default ActivationKeysFormSelect;
