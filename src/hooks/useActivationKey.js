import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { headers } from './useToken.js';

const fetchActivationKeyData = (token) => async (keyName) => {
  if (!keyName) {
    return false;
  }

  const response = await fetch(`/api/rhsm/v2/activation_keys/${keyName}`, {
    headers: { Authorization: `Bearer ${await token}`, ...headers() },
  });

  const activationKeysData = await response.json();

  return activationKeysData.body;
};

const getActivationKey = (token) => async (keyName) => {
  const keysData = await fetchActivationKeyData(token)(keyName);
  return keysData;
};

const useActivationKey = (keyName) => {
  const chrome = useChrome();

  return useQuery([`activation_key_${keyName}`], () =>
    getActivationKey(chrome?.auth?.getToken())(keyName)
  );
};

export { useActivationKey as default };
