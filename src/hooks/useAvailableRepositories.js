import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const fetchAdditionalRepositories = async (
  token,
  keyName,
  limit,
  offset = 0,
  search = ''
) => {
  if (!keyName) {
    return false;
  }

  const response = await fetch(
    `/api/rhsm/v2/activation_keys/${keyName}/available_repositories?default=Disabled&limit=${limit}&offset=${offset}&search=${search}`,
    {
      headers: { Authorization: `Bearer ${await token}` },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  const repositoriesData = await response.json();
  return repositoriesData;
};

const useAvailableRepositories = (keyName, page, pageSize, search = '') => {
  const chrome = useChrome();
  const token = chrome?.auth?.getToken();

  return useQuery(
    [
      `activation_key_${keyName}_available_repositories`,
      page,
      pageSize,
      search,
    ],
    () =>
      fetchAdditionalRepositories(
        token,
        keyName,
        pageSize,
        (page - 1) * pageSize,
        search
      )
  );
};

const usePrefetchAvailableRepositoriesNextPate = () => {
  const chrome = useChrome();

  return async (queryClient, keyName, page, pageSize, search = '') => {
    const token = chrome?.auth?.getToken();

    console.log('here');

    queryClient.prefetchQuery({
      queryKey: [
        `activation_key_${keyName}_available_repositories`,
        page,
        pageSize,
        search,
      ],
      queryFn: () =>
        fetchAdditionalRepositories(
          token,
          keyName,
          pageSize,
          (page - 1) * pageSize,
          search
        ),
    });
  };
};

export {
  useAvailableRepositories as default,
  usePrefetchAvailableRepositoriesNextPate,
};
