import React from 'react';
import { useState } from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
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
        <Content>
          <Content component={ContentVariants.p}>
            The core repositories for your operating system version, for example
            BaseOS and AppStream, are always enabled and do not need to be
            explicitly added to the activation key.
          </Content>
          <AddAdditionalRepositoriesButton
            onClick={handleEditAdditionalRepositoriesToggle}
          />
          <AddAdditionalRepositoriesModal
            isOpen={isEditAdditionalRepositoriesModalOpen}
            handleModalToggle={handleEditAdditionalRepositoriesToggle}
            keyName={activationKey.name}
          />
        </Content>
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
