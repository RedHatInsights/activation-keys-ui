import React from 'react';
import { useState } from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextContent,
  TextVariants,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Title,
} from '@patternfly/react-core';
import AdditionalRepositoriesTable from '../AdditionalRepositoriesTable';
import AddAdditionalRepositoriesButton from '../ActivationKey/AddAdditionalRepositoriesButton';
import AddAdditionalRepositoriesModal from '../Modals/AddAdditionalRepositoriesModal';

const AdditionalRepositoriesCard = (props) => {
  const { activationKey } = props;

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
