import { useMutation } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import type { AdditionalRepository, AuthToken } from './types';

export interface CreateActivationKeyData {
  name: string;
  description?: string;
  role?: string;
  serviceLevel?: string;
  usage?: string;
  /** Repository labels to attach to the new key. */
  additionalRepositories?: string[];
  releaseVersion?: string;
}

interface CreateActivationKeyBody {
  name: string;
  description?: string;
  role?: string;
  serviceLevel?: string;
  usage?: string;
  releaseVersion?: string;
  additionalRepositories?: AdditionalRepository[];
}

const activationKeyMutation = (token: AuthToken) => async (data: CreateActivationKeyData) => {
  const { name, description, role, serviceLevel, usage, additionalRepositories, releaseVersion } =
    data;

  const body: CreateActivationKeyBody = {
    name,
    description,
    role,
    serviceLevel,
    usage,
    ...(releaseVersion ? { releaseVersion } : {})
  };

  if (additionalRepositories) {
    body.additionalRepositories = additionalRepositories.map((repositoryLabel) => ({
      repositoryLabel
    }));
  }

  const response = await fetch('/api/rhsm/v2/activation_keys', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(
      `Status Code ${response.status}.  Error creating activation key: ${response.statusText}.`
    );
  }
  return response.json();
};

const useCreateActivationKey = () => {
  const chrome = useChrome();

  return useMutation({
    mutationFn: activationKeyMutation(chrome?.auth?.getToken())
  });
};

export { useCreateActivationKey as default };
