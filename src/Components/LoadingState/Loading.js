import React from 'react';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';

const Loading = () => {
  return (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default Loading;
