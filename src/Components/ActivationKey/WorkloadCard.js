import React from 'react';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { TextList } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListItem } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextListItemVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import propTypes from 'prop-types';
import ActivationKeysDocsPopover from '../ActivationKeysDocsPopover';

const WorkloadCard = ({ activationKey }) => {
  const notDefinedText = 'Not defined';
  const docsPopoverContent = (
    <TextContent>
      <Text>
        A release version enables you to configure your system to use a specific
        minor release of Red Hat Enterprise Linux. Setting a release version is
        useful if you are using an extended release of software, such as
        Extended Update Support. Most users will not set a release version.
      </Text>
    </TextContent>
  );
  return (
    <Card style={{ minHeight: '100%' }}>
      <CardHeader hasNoOffset={false} className="WorkloadCardHeader">
        <CardTitle>
          <Title headingLevel="h2">
            Workload{' '}
            <ActivationKeysDocsPopover
              popoverContent={docsPopoverContent}
              position="top"
            />
          </Title>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <TextContent>
          <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>
              Release version
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {activationKey && activationKey.releaseVersion
                ? activationKey.releaseVersion
                : notDefinedText}
            </TextListItem>
          </TextList>
        </TextContent>
      </CardBody>
    </Card>
  );
};

WorkloadCard.propTypes = {
  activationKey: propTypes.object,
};

export default WorkloadCard;
