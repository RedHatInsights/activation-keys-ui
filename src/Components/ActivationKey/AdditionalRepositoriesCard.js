import React from 'react';
import { useState } from 'react';
import propTypes from 'prop-types';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextVariants } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import AdditionalRepositoriesTable from '../AdditionalRepositoriesTable';
import useAvailableRepositories from '../../hooks/useAvailableRepositories';
import AddAdditionalRepositoriesButton from '../ActivationKey/AddAdditionalRepositoriesButton';
import AddAdditionalRepositoriesModal from '../Modals/AddAdditionalRepositoriesModal';

const AdditionalRepositoriesCard = (props) => {
  const { activationKey } = props;

  const {
    data: availableRepositories,
    isLoading,
    error,
  } = useAvailableRepositories(activationKey.name);

  const [
    isEditAdditionalRepositoriesModalOpen,
    setisEditAdditionalRepositoriesModalOpen,
  ] = useState(false);

  const handleEditAdditionalRepositoriesToggle = () => {
    setisEditAdditionalRepositoriesModalOpen(
      !isEditAdditionalRepositoriesModalOpen
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h2"> Additional repositories </Title>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <TextContent>
          <Text component={TextVariants.p}>
            The core repositories for your operating system version, for example
            BaseOS and AppStream, are always enabled and do not need to be
            explicitly added to the activation key.
          </Text>
          <AddAdditionalRepositoriesButton
            onClick={handleEditAdditionalRepositoriesToggle}
          />
          <AddAdditionalRepositoriesModal
            isOpen={isEditAdditionalRepositoriesModalOpen}
            handleModalToggle={handleEditAdditionalRepositoriesToggle}
            keyName={activationKey.name}
            repositories={availableRepositories}
            isLoading={isLoading}
            error={error}
          />
        </TextContent>
        <AdditionalRepositoriesTable
          repositories={activationKey.additionalRepositories}
          name={activationKey.name}
        />
      </CardBody>
    </Card>
  );
};

AdditionalRepositoriesCard.propTypes = {
  activationKey: propTypes.object,
  isLoading: propTypes.bool,
  error: propTypes.bool,
};

export default AdditionalRepositoriesCard;
