import { Button, type ButtonProps } from '@patternfly/react-core/dist/dynamic/components/Button';
import React, { type ReactNode } from 'react';
import NoAccessPopover from '../NoAccessPopover';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Relation, useHasRelation } from '../../hooks/useHasRelation';

export interface WriteOnlyButtonProps extends Omit<ButtonProps, 'children'> {
  children?: ReactNode;
  /** Shown on hover when the user does have write access. */
  enabledTooltip?: string;
  /** Shown on hover when the user does not have write access. */
  disabledTooltip?: string;
}

const WriteOnlyButton = (props: WriteOnlyButtonProps) => {
  const { children, enabledTooltip, disabledTooltip = 'Disabled', ...buttonProps } = props;

  const { has: canWriteActivationKeys } = useHasRelation(Relation.KEYS_EDIT);

  const isDisabled = !canWriteActivationKeys;

  const showEnabledTooltip = enabledTooltip && !isDisabled;

  return (
    <>
      {isDisabled ? (
        <NoAccessPopover
          content={() => (
            <Tooltip position="top" content={disabledTooltip} trigger="mouseenter">
              <Button {...buttonProps} isDisabled>
                {children}
              </Button>
            </Tooltip>
          )}
        />
      ) : (
        <>
          {showEnabledTooltip && (
            <Tooltip position="top" content={enabledTooltip} trigger="mouseenter">
              <Button {...buttonProps}>{children}</Button>
            </Tooltip>
          )}
          {!showEnabledTooltip && <Button {...buttonProps}>{children}</Button>}
        </>
      )}
    </>
  );
};

export default WriteOnlyButton;
