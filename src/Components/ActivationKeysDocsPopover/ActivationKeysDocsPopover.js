import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import propTypes from 'prop-types';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-question-circle-icon';

const ActivationKeysDocsPopover = (props) => {
  const { title, popoverContent, position } = props;
  const positions = {
    right: PopoverPosition.rightStart,
    left: PopoverPosition.leftStart,
    top: PopoverPosition.top,
    bottom: PopoverPosition.bottom,
  };
  return (
    <Popover
      headerContent={title}
      position={positions[position]}
      className="connector pf-v5-u-color-100"
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

ActivationKeysDocsPopover.propTypes = {
  popoverContent: propTypes.object,
  title: propTypes.string,
  position: propTypes.string,
};
