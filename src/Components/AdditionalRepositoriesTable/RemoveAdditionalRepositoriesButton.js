import React from 'react';
import PropTypes from 'prop-types';
import { WriteOnlyButton } from '../WriteOnlyButton';
import MinusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/minus-circle-icon';

const RemoveAdditionalRepositoriesButton = ({ onClick }) => {
  return (
    <WriteOnlyButton
      onClick={onClick}
      enabledTooltip="Remove"
      disabledTooltip="For editing access, contact your administrator."
      variant="plain"
      aria-label="Action"
      icon={<MinusCircleIcon />}
    />
  );
};

RemoveAdditionalRepositoriesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveAdditionalRepositoriesButton;
