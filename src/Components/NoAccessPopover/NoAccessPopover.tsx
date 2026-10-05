import React, { type ComponentType } from 'react';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

interface NoAccessPopoverProps {
  /** Rendered inside the tooltip; receives no props. */
  content: ComponentType;
}

const NoAccessPopover = ({ content: Button }: NoAccessPopoverProps) => {
  return (
    <React.Fragment>
      <Tooltip content={<div>For editing access, contact your administrator.</div>}>
        <div className="pf-v6-u-display-inline-block">
          <Button />
        </div>
      </Tooltip>
    </React.Fragment>
  );
};

export default NoAccessPopover;
