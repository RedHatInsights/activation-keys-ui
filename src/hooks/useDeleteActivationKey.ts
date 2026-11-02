import { useMutation } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { HttpError } from '../utils/errors';
import type { AuthToken } from './types';

const deleteActivationKeyMutation =
  (token: AuthToken) =>
  async (name: string): Promise<void> => {
    const response = await fetch(`/api/rhsm/v2/activation_keys/${name}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${await token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new HttpError(
        `Error deleting activation key: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
  };

const useDeleteActivationKey = () => {
  const chrome = useChrome();

  return useMutation({
    mutationFn: deleteActivationKeyMutation(chrome?.auth?.getToken())
  });
};

export { useDeleteActivationKey as default };
