import { useMutation } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const activationKeyMutation = (token) => async (data) => {
  const { name, role, serviceLevel, usage, releaseVersion, description } = data;

  const response = await fetch(`/api/rhsm/v2/activation_keys/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${await token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role,
      serviceLevel,
      usage,
      releaseVersion,
      description,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Status Code ${response.status}.  Error updating activation key: ${response.statusText}.`
    );
  }

  return response.json();
};

const useUpdateActivationKey = () => {
  const chrome = useChrome();
  return useMutation(activationKeyMutation(chrome.auth.getToken()));
};

export { useUpdateActivationKey as default };
