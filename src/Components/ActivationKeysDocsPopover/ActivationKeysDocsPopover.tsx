import React, { type ReactNode } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-question-circle-icon';

export type DocsPopoverPosition = 'right' | 'left' | 'top' | 'bottom';

interface ActivationKeysDocsPopoverProps {
  popoverContent?: ReactNode;
  title?: string;
  position?: DocsPopoverPosition;
}

const ActivationKeysDocsPopover = (props: ActivationKeysDocsPopoverProps) => {
  const { title, popoverContent, position } = props;
  const positions: Record<DocsPopoverPosition, PopoverPosition> = {
    right: PopoverPosition.rightStart,
    left: PopoverPosition.leftStart,
    top: PopoverPosition.top,
    bottom: PopoverPosition.bottom
  };
  return (
    <Popover
      headerContent={title}
      position={position ? positions[position] : undefined}
      className="connector pf-v6-u-color-100"
      bodyContent={popoverContent}
    >
      <Button
        icon={<OutlinedQuestionCircleIcon />}
        variant="plain"
        isInline
        style={{ padding: 0 }}
      />
    </Popover>
  );
};

export default ActivationKeysDocsPopover;
