import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { ApiResponse, AuthToken, SystemPurposeAttributes } from './types';

interface OrganizationBody {
  systemPurposeAttributes: SystemPurposeAttributes;
}

const fetchSystemPurposeAttributes = (token: AuthToken) => async (): Promise<OrganizationBody> => {
  const response = await fetch('/api/rhsm/v2/organization?include=system_purpose_attributes', {
    headers: { Authorization: `Bearer ${await token}` }
  });

  const responseData = (await response.json()) as ApiResponse<OrganizationBody>;

  return responseData.body;
};

const getSystemPurposeAttributes =
  (token: AuthToken) => async (): Promise<SystemPurposeAttributes> => {
    const data = await fetchSystemPurposeAttributes(token)();
    return data.systemPurposeAttributes;
  };

const useSystemPurposeAttributes = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['organization_system_purpose_attributes'],
    queryFn: getSystemPurposeAttributes(chrome?.auth?.getToken())
  });
};

export { useSystemPurposeAttributes as default };
