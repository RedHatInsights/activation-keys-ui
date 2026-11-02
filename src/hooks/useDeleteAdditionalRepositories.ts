import { useMutation } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { HttpError } from '../utils/errors';
import type { AdditionalRepository, AuthToken } from './types';

export interface DeleteAdditionalRepositoriesData {
  name: string;
  payload: AdditionalRepository[];
}

const deleteAdditionalRepositoriesMutation =
  (token: AuthToken) =>
  async ({ name, payload }: DeleteAdditionalRepositoriesData): Promise<void> => {
    const response = await fetch(`/api/rhsm/v2/activation_keys/${name}/additional_repositories`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${await token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new HttpError(
        `Error deleting additional repository: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
  };

const useDeleteAdditionalRepositories = () => {
  const chrome = useChrome();

  return useMutation({
    mutationFn: deleteAdditionalRepositoriesMutation(chrome?.auth?.getToken())
  });
};

export default useDeleteAdditionalRepositories;
