import { useQuery } from '@tanstack/react-query';
import useAvailableRepositories from '../useAvailableRepositories';

jest.mock('@tanstack/react-query');

const mockUseQuery = useQuery as unknown as jest.Mock;

/**
 * NOTE: `useAvailableRepositories` takes six arguments. These tests call it
 * with only the key name, which works because `useQuery` is mocked out.
 * Preserved verbatim.
 */
const useAvailableRepositoriesWithKeyNameOnly = useAvailableRepositories as unknown as (
  keyName: string
) => { isLoading: boolean; data?: unknown; error?: unknown };

describe('useAvailableRepositories', () => {
  const keyName = 'testKey';

  beforeEach(() => {
    mockUseQuery.mockReset();
  });
  describe('useAvailableRepositories', () => {
    test('should fetch available repositories correctly', async () => {
      const repositories = [];
      for (let i = 1; i <= 105; i++) {
        repositories.push({ repositoryId: i, repositoryName: `Repo ${i}` });
      }

      mockUseQuery.mockReturnValueOnce({
        isLoading: false,
        data: repositories
      });

      const result = useAvailableRepositoriesWithKeyNameOnly(keyName);

      expect(result.isLoading).toBe(false);
      expect(result.data).toEqual(repositories);
    });
  });

  test('should handle error during fetch correctly', async () => {
    mockUseQuery.mockReturnValueOnce({
      isLoading: false,
      error: new Error('Fetch failed')
    });

    const result = useAvailableRepositoriesWithKeyNameOnly(keyName);

    expect(result.isLoading).toBe(false);
    expect(result.error).toEqual(new Error('Fetch failed'));
  });
});
