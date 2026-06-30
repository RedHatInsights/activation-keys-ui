import { renderHook, waitFor } from '@testing-library/react';
import useUser from '../useUser';
import { createQueryWrapper } from '../../utils/testHelpers';
import { useAuthenticateUser } from '../../utils/platformServices';

jest.mock('../../utils/platformServices.js');

useAuthenticateUser.mockResolvedValue({
  data: { identity: { account_number: '1', internal: { org_id: 1 } } },
});

describe('useUser hook', () => {
  it('gets the user data and permissions', async () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() =>
      expect(result.current.data).toEqual({
        accountNumber: '1',
        orgId: 1,
      }),
    );
  });
});
