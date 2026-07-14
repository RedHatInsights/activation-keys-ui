import {
  // fetchDefaultWorkspace, TODO: Add back once the sdk is fixed
  useAccessCheckContext,
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

describe('useHasRelation hook', () => {
  beforeEach(() => {
    useAccessCheckContext.mockReturnValue(true);
    fetchDefaultWorkspace.mockReturnValue('workspace');
  });

  it('returns true when access check passes', async () => {
    checkSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.has).toBe(true));
  });

  it('returns false while loading', () => {
    checkSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    checkSelf.mockReturnValue({ allowed: 'ALLOWED_FALSE' });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  it('returns false on query error', async () => {
    checkSelf.mockImplementation(() => {
      throw new Error('whoops');
    });

    const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  describe('unexpected response from kessel', () => {
    it('returns false on empty object', async () => {
      checkSelf.mockReturnValue({});

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });

    it('returns false on unexpected allowed value', async () => {
      checkSelf.mockReturnValue({ allowed: 'A_WEIRD_VALUE' });

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });

    it('returns false when the default workspace fails to fetch', async () => {
      checkSelf.mockReturnValue({ allowed: 'ALLOWED_TRUE' });
      fetchDefaultWorkspace.mockRejectedValue('oops!');

      const { result } = renderHook(() => useHasRelation(Relation.KEYS_VIEW), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });
  });
});
