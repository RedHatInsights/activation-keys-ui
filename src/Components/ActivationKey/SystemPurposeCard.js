import React from 'react';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';

import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import propTypes from 'prop-types';
import ActivationKeysDocsPopover from '../ActivationKeysDocsPopover';

const SystemPurposeCard = ({ activationKey }) => {
  const notDefinedText = 'Not defined';

  const docsPopoverContent = (
    <Content>
      <Content component="p">
        System purpose values are used by the subscriptions service to help
        filter and identify hosts. Setting values for these attributes is
        optional, but doing so ensures that subscriptions reporting accurately
        reflects the system.
      </Content>
    </Content>
  );
  return (
    <Card>
      <CardHeader hasNoOffset={false} className="SystemPurposeCardHeader">
        <CardTitle>
          <Title headingLevel="h2">
            System Purpose{' '}
            <ActivationKeysDocsPopover
              popoverContent={docsPopoverContent}
              position="top"
            />{' '}
          </Title>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Content>
          <Content component={ContentVariants.dl}>
            <Content component={ContentVariants.dt}>Role</Content>
            <Content component={ContentVariants.dd}>
              {activationKey && activationKey.role
                ? activationKey.role
                : notDefinedText}
            </Content>
            <Content component={ContentVariants.dt}>SLA</Content>
            <Content component={ContentVariants.dd}>
              {activationKey && activationKey.serviceLevel
                ? activationKey.serviceLevel
                : notDefinedText}
            </Content>
            <Content component={ContentVariants.dt}>Usage</Content>
            <Content component={ContentVariants.dd}>
              {activationKey && activationKey.usage
                ? activationKey.usage
                : notDefinedText}
            </Content>
          </Content>
        </Content>
      </CardBody>
    </Card>
  );
};

SystemPurposeCard.propTypes = {
  activationKey: propTypes.object,
};

export default SystemPurposeCard;
