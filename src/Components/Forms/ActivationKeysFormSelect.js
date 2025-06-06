import React, { useState } from 'react';
import { FormGroup } from '@patternfly/react-core/dist/dynamic/components/Form';
import { FormHelperText } from '@patternfly/react-core/dist/dynamic/components/Form';
import { HelperText } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { HelperTextItem } from '@patternfly/react-core/dist/dynamic/components/HelperText';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';

import PropTypes from 'prop-types';

const ActivationKeysFormSelect = (props) => {
  const {
    label,
    popover,
    data,
    onSelect,
    helperText,
    name,
    value,
    placeholderValue,
    disableDefaultValues,
  } = props;
  const [selected, setSelected] = useState('');
  const options = data.map((role) => {
    return <FormSelectOption key={role} value={role} label={role} />;
  });
  const valueChange = (value) => {
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
          label={placeholderValue}
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

ActivationKeysFormSelect.propTypes = {
  label: PropTypes.string.isRequired,
  popover: PropTypes.element,
  helperText: PropTypes.string,
  data: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  name: PropTypes.string,
  placeholderValue: PropTypes.string,
  value: PropTypes.string,
  disableDefaultValues: PropTypes.bool,
};

export default ActivationKeysFormSelect;
