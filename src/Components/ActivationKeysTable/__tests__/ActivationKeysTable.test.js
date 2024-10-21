import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import ActivationKeysTable from '../ActivationKeysTable';
import useActivationKeys from '../../../hooks/useActivationKeys';
import { printDate, sortActivationKeys } from '../../../utils/dateHelpers';
import { get, def } from 'bdd-lazy-var';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
jest.mock('../../../hooks/useActivationKeys');
jest.mock('uuid', () => {
  return { v4: jest.fn(() => '00000000-0000-0000-0000-000000000000') };
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/connector/test-key' }),
}));

const queryClient = new QueryClient();

const Table = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ActivationKeysTable onDelete={() => {}} />
    </QueryClientProvider>
  </BrowserRouter>
);

jest.mock(
  '@redhat-cloud-services/frontend-components/Unavailable',
  // eslint-disable-next-line react/display-name
  () => () => <div>Unavailable</div>
);

describe('ActivationKeysTable', () => {
  def('rbacPermissions', () => {
    return {
      rbacPermissions: {
        canReadActivationKeys: true,
        canWriteActivationKeys: true,
      },
    };
  });
  def('loading', () => false);
  def('error', () => false);
  def('data', () => [
    {
      name: 'A',
      role: 'B',
      serviceLevel: 'C',
      usage: 'D',
    },
  ]);

  beforeEach(() => {
    jest
      .spyOn(queryClient, 'getQueryData')
      .mockReturnValue(get('rbacPermissions'));
    useActivationKeys.mockReturnValue({
      isLoading: get('loading'),
      error: get('error'),
      data: get('data'),
    });
  });

  it('renders correctly', () => {
    const { container } = render(<Table />);

    expect(container).toMatchSnapshot();
  });

  describe('when loading', () => {
    def('loading', () => true);

    it('renders the loading state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('when user does not have write permissions', () => {
    def('rbacPermissions', () => {
      return {
        rbacPermissions: {
          canReadActivationKeys: true,
          canWriteActivationKeys: false,
        },
      };
    });
  });

  describe('when there is an error', () => {
    def('error', () => true);

    it('renders the error state', () => {
      const { container } = render(<Table />);

      expect(container).toMatchSnapshot();
    });
  });

  describe('printDate', () => {
    it('should return the date in YYY-MM-DD format for a valid string', () => {
      const result = printDate('2023-10-21T10:30:00Z');
      expect(result).toBe('2023-10-21');
    });
  });
  it('should return "Invalid Date" for an empty string', () => {
    const result = printDate('');
    expect(result).toBe('Invalid Date');
  });
  it('should return "Invalid Date" for an invalid date string', () => {
    const result = printDate('invalid date');
    expect(result).toBe('Invalid Date');
  });
  it('should correctly format single digit months and days with leading zeros', () => {
    const result = printDate('2023-10-21T10:30:00Z');
    expect(result).toBe('2023-10-21');
  });
});
describe('sortData', () => {
  const mockData = [
    { name: 'Key1', updatedAt: '2023-10-21T10:30:00Z' },
    { name: 'Key2', updatedAt: '2023-10-19T10:30:00Z' },
    { name: 'Key3', updatedAt: '2023-10-20T10:30:00Z' },
  ];
  const mockColumnNames = ['name', 'role', 'SLA', 'Usage', 'updatedAt'];

  it('should sort data by date in ascending order', () => {
    const result = sortActivationKeys(mockData, 4, 'asc', mockColumnNames);
    expect(result[0].name).toBe('Key2');
    expect(result[1].name).toBe('Key3');
    expect(result[2].name).toBe('Key1');
  });
  it('should sort data by date in descending order', () => {
    const result = sortActivationKeys(mockData, 4, 'desc', mockColumnNames);
    expect(result[2].name).toBe('Key2');
    expect(result[1].name).toBe('Key3');
    expect(result[0].name).toBe('Key1');
  });
  it('should return and empty array if the input data is empty', () => {
    const result = sortActivationKeys([], 4, 'asc', mockColumnNames);
    expect(result).toEqual([]);
  });
});
