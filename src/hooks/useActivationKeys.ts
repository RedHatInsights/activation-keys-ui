import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { ActivationKey, ApiResponse, AuthToken } from './types';

const fetchActivationKeysData = (token: AuthToken) => async (): Promise<ActivationKey[]> => {
  const response = await fetch('/api/rhsm/v2/activation_keys', {
    headers: { Authorization: `Bearer ${await token}` }
  });

  const activationKeysData = (await response.json()) as ApiResponse<ActivationKey[]>;

  return activationKeysData.body;
};

const getActivationKeys = (token: AuthToken) => async (): Promise<ActivationKey[]> => {
  const keysData = await fetchActivationKeysData(token)();
  return keysData;
};

const useActivationKeys = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['activation_keys'],
    queryFn: getActivationKeys(chrome?.auth?.getToken())
  });
};

export { useActivationKeys as default };
