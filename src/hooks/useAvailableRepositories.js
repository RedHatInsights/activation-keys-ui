import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const fetchAdditionalRepositories = async (
  token,
  keyName,
  limit,
  offset = 0,
  filterBy = '',
  filter = '',
  sortBy = '',
  sortDirection = ''
) => {
  if (!keyName) {
    return false;
  }

  const response = await fetch(
    `/api/rhsm/v2/activation_keys/${keyName}/available_repositories?default=Disabled&limit=${limit}&offset=${offset}&${filterBy}=${filter}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
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

const useAvailableRepositories = (
  keyName,
  page,
  pageSize,
  filterBy,
  filter,
  sortBy,
  sortDirection
) => {
  const chrome = useChrome();
  const token = chrome?.auth?.getToken();

  return useQuery(
    [
      `activation_key_${keyName}_available_repositories`,
      page,
      pageSize,
      filterBy,
      filter,
      sortBy,
      sortDirection,
    ],
    () =>
      fetchAdditionalRepositories(
        token,
        keyName,
        pageSize,
        (page - 1) * pageSize,
        filterBy,
        filter,
        sortBy,
        sortDirection
      )
  );
};

const usePrefetchAvailableRepositoriesNextPage = () => {
  const chrome = useChrome();

  return async (
    queryClient,
    keyName,
    page,
    pageSize,
    filterBy,
    filter,
    sortBy,
    sortDirection
  ) => {
    const token = chrome?.auth?.getToken();

    queryClient.prefetchQuery({
      queryKey: [
        `activation_key_${keyName}_available_repositories`,
        page,
        pageSize,
        filterBy,
        filter,
        sortBy,
        sortDirection,
      ],
      queryFn: () =>
        fetchAdditionalRepositories(
          token,
          keyName,
          pageSize,
          (page - 1) * pageSize,
          filterBy,
          filter,
          sortBy,
          sortDirection
        ),
    });
  };
};

export {
  useAvailableRepositories as default,
  usePrefetchAvailableRepositoriesNextPage,
};
