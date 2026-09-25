import { renderHook, waitFor } from '@testing-library/react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useOrgID from '../useOrgID';
import { createQueryWrapper } from '../../utils/testHelpers';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => jest.fn());

describe('useOrgID hook', () => {
  it('returns the org ID of the authenticated user', async () => {
    useChrome.mockImplementation(() => ({
      auth: {
        getUser: () => Promise.resolve({ identity: { internal: { org_id: '123' } } })
      }
    }));

    const { result } = renderHook(() => useOrgID(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.data).toEqual('123'));
  });

  it('errors when the user cannot be authenticated', async () => {
    useChrome.mockImplementation(() => ({
      auth: {
        getUser: () => Promise.reject(new Error('Error getting user'))
      }
    }));

    const { result } = renderHook(() => useOrgID(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
