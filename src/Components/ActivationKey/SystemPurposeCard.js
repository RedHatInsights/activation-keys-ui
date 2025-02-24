import React from 'react';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { TextList } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListItem } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListItemVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import propTypes from 'prop-types';
import ActivationKeysDocsPopover from '../ActivationKeysDocsPopover';

const SystemPurposeCard = ({ activationKey }) => {
  const notDefinedText = 'Not defined';

  const docsPopoverContent = (
    <TextContent>
      <Text>
        System purpose values are used by the subscriptions service to help
        filter and identify hosts. Setting values for these attributes is
        optional, but doing so ensures that subscriptions reporting accurately
        reflects the system.
      </Text>
    </TextContent>
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
        <TextContent>
          <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>
              Role
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {activationKey && activationKey.role
                ? activationKey.role
                : notDefinedText}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dt}>SLA</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {activationKey && activationKey.serviceLevel
                ? activationKey.serviceLevel
                : notDefinedText}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dt}>
              Usage
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {activationKey && activationKey.usage
                ? activationKey.usage
                : notDefinedText}
            </TextListItem>
          </TextList>
        </TextContent>
      </CardBody>
    </Card>
  );
};

SystemPurposeCard.propTypes = {
  activationKey: propTypes.object,
};

export default SystemPurposeCard;
