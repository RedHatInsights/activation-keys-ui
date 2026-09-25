import React from 'react';
import Loading from '../LoadingState/Loading';
import propTypes from 'prop-types';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Relation, useHasRelation } from '../../hooks/useHasRelation';
import useOrgID from '../../hooks/useOrgID';
import Unavailable from '@redhat-cloud-services/frontend-components/Unavailable';

const Authentication = ({ children }) => {
  const { has: canReadActivationKeys, isLoading: canReadActivationKeysIsLoading } = useHasRelation(
    Relation.KEYS_VIEW
  );

  // Preload edit for later
  useHasRelation(Relation.KEYS_EDIT);

  const { isLoading, isFetching, isError } = useOrgID();

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
  children: propTypes.node
};

export default Authentication;
