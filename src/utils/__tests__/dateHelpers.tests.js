import React from 'react';
import '@testing-library/jest-dom';
import { printDate, sortActivationKeys } from '../dateHelpers';
jest.mock('../../hooks/useActivationKey');
jest.mock('uuid', () => {
  return { v4: jest.fn(() => '00000000-0000-0000-0000-000000000000') };
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/connector/test-key' }),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components/Unavailable',
  // eslint-disable-next-line react/display-name
  () => () => <div>Unavailable</div>
);

describe('printDate', () => {
  it('should return the date in YYYY-MM-DD format for a valid string', () => {
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

describe('sortActivationKeys', () => {
  const mockData = [
    { name: 'Key1', updatedAt: '2023-10-21T10:30:00Z' },
    { name: 'Key2', updatedAt: '2023-10-19T10:30:00Z' },
    { name: 'Key3', updatedAt: '2023-10-20T10:30:00Z' },
  ];
  const mockColumnNames = ['name', 'role', 'SLA', 'Usage', 'updatedAt'];

  it('should sort activation key data by date in ascending order', () => {
    const result = sortActivationKeys(mockData, 4, 'asc', mockColumnNames);
    expect(result[0].name).toBe('Key1');
    expect(result[1].name).toBe('Key2');
    expect(result[2].name).toBe('Key3');
  });
  it('should sort activation key data by date in descending order', () => {
    const result = sortActivationKeys(mockData, 4, 'desc', mockColumnNames);
    expect(result[2].name).toBe('Key3');
    expect(result[1].name).toBe('Key2');
    expect(result[0].name).toBe('Key1');
  });
  it('should return and empty array if the input data is empty', () => {
    const result = sortActivationKeys([], 4, 'asc', mockColumnNames);
    expect(result).toEqual([]);
  });
});
