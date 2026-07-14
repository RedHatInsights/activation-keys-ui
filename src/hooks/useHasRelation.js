import {
  // fetchDefaultWorkspace, TODO: Add back once the sdk is fixed
  useAccessCheckContext,
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { useQuery } from '@tanstack/react-query';
import { fetchDefaultWorkspace } from '../utils/fetchDefaultWorkspace'; // TODO remove once sdk is fixed

// 5 minutes * 60 seconds * 1000 milliseconds
const QUERY_STALE_TIME = 5 * 60 * 1000;

export const Relation = {
  KEYS_VIEW: 'config_manager_activation_keys_view',
  KEYS_EDIT: 'config_manager_activation_keys_edit',
};

const useDefaultWorkspace = () =>
  useQuery({
    queryKey: ['rbac', 'default-workspace'],
    queryFn: async () => await fetchDefaultWorkspace(window.location.origin),
    staleTime: QUERY_STALE_TIME,
  });

/**
 * useHasRelation checks if the current user has a given relation on the default workspace
 */
export const useHasRelation = (relation) => {
  const accessCheckContext = useAccessCheckContext();
  const {
    data: defaultWorkspace,
    isLoading: defaultWorkspaceIsLoading,
    isError: defaultWorkspaceIsError,
  } = useDefaultWorkspace();

  const { data: has, isLoading: accessCheckIsLoading } = useQuery({
    queryKey: ['kessel', relation, defaultWorkspace?.id],
    queryFn: async () => {
      return (
        (
          await checkSelf(accessCheckContext, {
            relation,
            resource: {
              id: defaultWorkspace.id,
              type: 'workspace',
              reporter: { type: 'rbac' },
            },
          })
        ).allowed === 'ALLOWED_TRUE'
      );
    },
    enabled: !defaultWorkspaceIsLoading && !defaultWorkspaceIsError,
    staleTime: QUERY_STALE_TIME,
  });

  return {
    has: !!has,
    isLoading: accessCheckIsLoading || defaultWorkspaceIsLoading,
  };
};
