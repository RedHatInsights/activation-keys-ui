import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const fetchAdditionalRepositories = async (
  token,
  keyName,
  limit,
  offset = 0,
  filters = {},
  sortBy = '',
  sortDirection = '',
) => {
  if (!keyName) {
    return false;
  }

  const filterQuery = Object.entries(filters)
    .map(([k, v]) => {
      if (k == 'rpm_type') {
        v = v.map((v) => {
          if (v == 'binary') {
            return 'binary,binary_image,binary_iso';
          }
          if (v == 'debug') {
            return 'debug';
          }
          if (v == 'source') {
            return 'source,source_iso';
          }
        });
      }
      return `${k}=${v}`;
    })
    .join('&');

  const response = await fetch(
    `/api/rhsm/v2/activation_keys/${keyName}/available_repositories?default=Disabled&limit=${limit}&offset=${offset}&${filterQuery}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
    {
      headers: { Authorization: `Bearer ${await token}` },
    },
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
  filters,
  sortBy,
  sortDirection,
) => {
  const chrome = useChrome();
  const token = chrome?.auth?.getToken();

  return useQuery({
    queryKey: [
      `activation_key_${keyName}_available_repositories`,
      page,
      pageSize,
      filters,
      sortBy,
      sortDirection,
    ],
    queryFn: () =>
      fetchAdditionalRepositories(
        token,
        keyName,
        pageSize,
        (page - 1) * pageSize,
        filters,
        sortBy,
        sortDirection,
      ),
  });
};

const usePrefetchAvailableRepositoriesNextPage = () => {
  const chrome = useChrome();

  return async (
    queryClient,
    keyName,
    page,
    pageSize,
    filters,
    sortBy,
    sortDirection,
  ) => {
    const token = chrome?.auth?.getToken();

    queryClient.prefetchQuery({
      queryKey: [
        `activation_key_${keyName}_available_repositories`,
        page,
        pageSize,
        filters,
        sortBy,
        sortDirection,
      ],
      queryFn: () =>
        fetchAdditionalRepositories(
          token,
          keyName,
          pageSize,
          (page - 1) * pageSize,
          filters,
          sortBy,
          sortDirection,
        ),
    });
  };
};

export {
  useAvailableRepositories as default,
  usePrefetchAvailableRepositoriesNextPage,
};
