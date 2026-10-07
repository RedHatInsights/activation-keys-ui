import {
  // fetchDefaultWorkspace, TODO: Add back once the sdk is fixed
  useAccessCheckContext
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { renderHook, waitFor } from '@testing-library/react';
import { Relation, useHasRelation } from '../useHasRelation';
import { createQueryWrapper } from '../../utils/testHelpers';

jest.mock('@project-kessel/react-kessel-access-check');
jest.mock('@project-kessel/react-kessel-access-check/core/api-client');

// ------------------------------------------------------------
// TODO: remove once sdk is used for default workspace fetching
// ------------------------------------------------------------

import { fetchDefaultWorkspace } from '../../utils/fetchDefaultWorkspace';
jest.mock('../../utils/fetchDefaultWorkspace');

// ------------------------------------------------------------
// TODO: End remove block
// ------------------------------------------------------------

const mockUseAccessCheckContext = useAccessCheckContext as unknown as jest.Mock;
const mockFetchDefaultWorkspace = fetchDefaultWorkspace as unknown as jest.Mock;
const mockCheckSelf = checkSelf as unknown as jest.Mock;

describe('useHasRelation hook', () => {
  beforeEach(() => {
    mockUseAccessCheckContext.mockReturnValue(true);
    mockFetchDefaultWorkspace.mockReturnValue('workspace');
  });

  it('returns true when access check passes', async () => {
    mockCheckSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.has).toBe(true));
  });

  it('returns false while loading', () => {
    mockCheckSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper()
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    mockCheckSelf.mockReturnValue({ allowed: 'ALLOWED_FALSE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  it('returns false on query error', async () => {
    mockCheckSelf.mockImplementation(() => {
      throw new Error('whoops');
    });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  describe('unexpected response from kessel', () => {
    it('returns false on empty object', async () => {
      mockCheckSelf.mockReturnValue({});

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper()
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });

    it('returns false on unexpected allowed value', async () => {
      mockCheckSelf.mockReturnValue({ allowed: 'A_WEIRD_VALUE' });

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper()
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });

    it('returns false when the default workspace fails to fetch', async () => {
      mockCheckSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });
      mockFetchDefaultWorkspace.mockRejectedValue('oops!');

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper()
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });
  });
});
