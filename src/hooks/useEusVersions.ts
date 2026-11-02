import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { HttpError } from '../utils/errors';
import type { ApiResponse, AuthToken, EusProduct } from './types';

const fetchEusVersions = (token: AuthToken) => async (): Promise<EusProduct[]> => {
  const response = await fetch('/api/rhsm/v2/products/RHEL/extended-update-support-products', {
    headers: { Authorization: `Bearer ${await token}` }
  });

  if (!response.ok) {
    throw new HttpError(
      `Failed to fetch EUS versions: ${response.statusText}`,
      response.status,
      response.statusText
    );
  }

  const eusVersionsData = (await response.json()) as ApiResponse<EusProduct[]>;

  return eusVersionsData.body;
};

const useEusVersions = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['eus_versions'],
    queryFn: () => fetchEusVersions(chrome?.auth?.getToken())(),
    retry: (failureCount, error) => {
      if (failureCount < 3 && String(error) != '400') {
        return true;
      }
      return false;
    }
  });
};

export { useEusVersions as default };
