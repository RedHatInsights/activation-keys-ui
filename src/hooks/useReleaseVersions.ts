import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { ApiResponse, AuthToken, EusProduct } from './types';

const fetchReleaseVersions = (token: AuthToken) => async (): Promise<EusProduct[]> => {
  const response = await fetch(`/api/rhsm/v2/products/RHEL/extended-update-support-versions`, {
    headers: { Authorization: `Bearer ${await token}` }
  });

  const releaseVersions = (await response.json()) as ApiResponse<EusProduct[]>;

  return releaseVersions.body;
};

const getReleaseVersions = (token: AuthToken) => async (): Promise<EusProduct[]> => {
  const keysData = await fetchReleaseVersions(token)();
  return keysData;
};

const useReleaseVersions = (keyName?: string) => {
  const chrome = useChrome();

  return useQuery({
    queryKey: [`activation_key_${keyName}`],
    queryFn: () => getReleaseVersions(chrome?.auth?.getToken())()
  });
};

export { useReleaseVersions as default };
