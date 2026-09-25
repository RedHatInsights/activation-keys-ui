import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const useOrgID = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['orgId'],
    queryFn: async () => {
      const user = await chrome?.auth?.getUser();
      return user?.identity?.internal?.org_id;
    }
  });
};

export default useOrgID;
