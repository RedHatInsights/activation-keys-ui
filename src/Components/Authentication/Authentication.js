import React from 'react';
import Loading from '../LoadingState/Loading';
import propTypes from 'prop-types';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Relation, useHasRelation } from '../../hooks/useHasRelation';
import useUser from '../../hooks/useUser';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';

const Authentication = ({ children }) => {
  const {
    has: canReadActivationKeys,
    isLoading: canReadActivationKeysIsLoading,
  } = useHasRelation(Relation.KEYS_VIEW);

  const { isLoading, isFetching, isError } = useUser();

  if (isError) {
    return <Unavailable />;
  } else if (!canReadActivationKeys && !canReadActivationKeysIsLoading) {
    return <NotAuthorized serviceName="Activation Keys" />;
  } else if (canReadActivationKeysIsLoading || isLoading || isFetching) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
};

Authentication.propTypes = {
  children: propTypes.node,
};

export default Authentication;
