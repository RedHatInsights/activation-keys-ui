import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import NoAccessPopover from '../NoAccessPopover';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

const WriteOnlyButton = (props) => {
  const {
    children,
    enabledTooltip,
    disabledTooltip = 'Disabled',
    ...buttonProps
  } = props;

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);
  const isDisabled = !user?.rbacPermissions.canWriteActivationKeys;

  const showEnabledTooltip = enabledTooltip && !isDisabled;

  return (
    <>
      {isDisabled ? (
        <NoAccessPopover
          content={() => (
            <Tooltip
              position="top"
              content={disabledTooltip}
              trigger="mouseenter"
            >
              <Button {...buttonProps} isDisabled>
                {children}
              </Button>
            </Tooltip>
          )}
        />
      ) : (
        <>
          {showEnabledTooltip && (
            <Tooltip
              position="top"
              content={enabledTooltip}
              trigger="mouseenter"
            >
              <Button {...buttonProps}>{children}</Button>
            </Tooltip>
          )}
          {!showEnabledTooltip && <Button {...buttonProps}>{children}</Button>}
        </>
      )}
    </>
  );
};

WriteOnlyButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  enabledTooltip: PropTypes.string,
  disabledTooltip: PropTypes.string,
};

export default WriteOnlyButton;
