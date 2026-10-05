import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { ActivationKey, ApiResponse, AuthToken } from './types';

const fetchActivationKeyData =
  (token: AuthToken) =>
  async (keyName?: string): Promise<ActivationKey | false> => {
    if (!keyName) {
      return false;
    }

    const response = await fetch(`/api/rhsm/v2/activation_keys/${keyName}`, {
      headers: { Authorization: `Bearer ${await token}` }
    });

    const activationKeysData = (await response.json()) as ApiResponse<ActivationKey>;

    return activationKeysData.body;
  };

const getActivationKey =
  (token: AuthToken) =>
  async (keyName?: string): Promise<ActivationKey | false> => {
    const keysData = await fetchActivationKeyData(token)(keyName);
    return keysData;
  };

const useActivationKey = (keyName?: string) => {
  const chrome = useChrome();

  return useQuery({
    queryKey: [`activation_key_${keyName}`],
    queryFn: () => getActivationKey(chrome?.auth?.getToken())(keyName)
  });
};

export { useActivationKey as default };
