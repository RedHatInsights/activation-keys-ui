import { type QueryClient, useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type {
  AuthToken,
  AvailableRepositoriesFilters,
  AvailableRepositoriesResponse,
  SortDirection
} from './types';

type FilterValue = string | string[] | undefined;

const expandRpmType = (value: string): string | undefined => {
  if (value == 'binary') {
    return 'binary,binary_image,binary_iso';
  }
  if (value == 'debug') {
    return 'debug';
  }
  if (value == 'source') {
    return 'source,source_iso';
  }
  return undefined;
};

const fetchAdditionalRepositories = async (
  token: AuthToken,
  keyName: string | undefined,
  limit: number,
  offset = 0,
  filters: AvailableRepositoriesFilters = {},
  sortBy = '',
  sortDirection: SortDirection | '' = ''
): Promise<AvailableRepositoriesResponse | false> => {
  if (!keyName) {
    return false;
  }

  const filterQuery = Object.entries(filters as Record<string, FilterValue>)
    .map(([k, v]) => {
      if (k == 'rpm_type' && Array.isArray(v)) {
        v = v.map(expandRpmType) as string[];
      }
      return `${k}=${v}`;
    })
    .join('&');

  const response = await fetch(
    `/api/rhsm/v2/activation_keys/${keyName}/available_repositories?default=Disabled&limit=${limit}&offset=${offset}&${filterQuery}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
    {
      headers: { Authorization: `Bearer ${await token}` }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  const repositoriesData = (await response.json()) as AvailableRepositoriesResponse;
  return repositoriesData;
};

const useAvailableRepositories = (
  keyName: string | undefined,
  page: number,
  pageSize: number,
  filters: AvailableRepositoriesFilters,
  sortBy: string,
  sortDirection: SortDirection
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
      sortDirection
    ],
    queryFn: () =>
      fetchAdditionalRepositories(
        token,
        keyName,
        pageSize,
        (page - 1) * pageSize,
        filters,
        sortBy,
        sortDirection
      )
  });
};

const usePrefetchAvailableRepositoriesNextPage = () => {
  const chrome = useChrome();

  return async (
    queryClient: QueryClient,
    keyName: string | undefined,
    page: number,
    pageSize: number,
    filters: AvailableRepositoriesFilters,
    sortBy: string,
    sortDirection: SortDirection
  ): Promise<void> => {
    const token = chrome?.auth?.getToken();

    queryClient.prefetchQuery({
      queryKey: [
        `activation_key_${keyName}_available_repositories`,
        page,
        pageSize,
        filters,
        sortBy,
        sortDirection
      ],
      queryFn: () =>
        fetchAdditionalRepositories(
          token,
          keyName,
          pageSize,
          (page - 1) * pageSize,
          filters,
          sortBy,
          sortDirection
        )
    });
  };
};

export { useAvailableRepositories as default, usePrefetchAvailableRepositoriesNextPage };
