import { act, renderHook } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utils/testHelpers';
import useCreateActivationKey from '../useCreateActivationKey';

enableFetchMocks();

describe('useActivationKeys', () => {
  it('creates activation key', async () => {
    fetch.mockResponseOnce(JSON.stringify({ body: { id: 'id' } }));
    const keyParams = {
      name: 'A',
      description: 'description',
      role: 'role',
      serviceLevel: 'sla',
      usage: 'usage',
    };
    const { result } = renderHook(() => useCreateActivationKey(), {
      wrapper: createQueryWrapper(),
    });
    await act(async () => {
      result.current.mutate(keyParams);
    });
    expect(fetch).toHaveBeenCalled();
  });
});
