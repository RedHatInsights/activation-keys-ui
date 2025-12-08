import React from 'react';
import ActivationKeyWizard from '../ActivationKeyWizard';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useCreateActivationKey from '../../../hooks/useCreateActivationKey';
import useEusVersions from '../../../hooks/useEusVersions';
import useReleaseVersions from '../../../hooks/useReleaseVersions';

jest.mock('../../../hooks/useCreateActivationKey');
jest.mock('../../../hooks/useEusVersions');
jest.mock('../../../hooks/useReleaseVersions');

const queryClient = new QueryClient();

const mutate = jest.fn();
useCreateActivationKey.mockReturnValue({
  mutate,
  error: false,
});
useEusVersions.mockReturnValue({});
useReleaseVersions.mockReturnValue({});

jest.mock('uuid', () => ({
  __esModule: true,
  ...jest.requireActual('uuid'),
  v4: jest.fn(() => '11111111-1111-1111-1111-111111111111'),
}));

describe('Create Activation Key Wizard', () => {
  const pages = [1, 2, 3, 4, 5];
  pages.forEach((page) => {
    it(`renders page ${page} correctly`, () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ActivationKeyWizard handleModalToggle={() => {}} isOpen={true} />
        </QueryClientProvider>,
      );
      for (let i = 1; i < page; i++) {
        const nextStepBtn = screen.getByText(i < 4 ? 'Next' : 'Create');
        fireEvent.click(nextStepBtn);
      }
      expect(document.body).toMatchSnapshot();
    });
  });

  it("Doesn't confirm on close when nothing has been done", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ActivationKeyWizard handleModalToggle={() => {}} isOpen={true} />
      </QueryClientProvider>,
    );
    fireEvent.click(
      container.nextSibling.querySelector('.pf-v6-c-modal-box__close'),
    );
    expect(document.body).toMatchSnapshot();
  });

  it('Confirms on close one next has been clicked', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ActivationKeyWizard handleModalToggle={() => {}} isOpen={true} />
      </QueryClientProvider>,
    );

    const nextStepBtn = screen.getByText('Next');
    fireEvent.click(nextStepBtn);
    fireEvent.click(
      container.nextSibling.querySelector('.pf-v6-c-modal-box__close'),
    );
    expect(document.body).toMatchSnapshot();
  });

  it('Saves data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ActivationKeyWizard handleModalToggle={() => {}} isOpen={true} />
      </QueryClientProvider>,
    );
    for (let i = 1; i < 5; i++) {
      const nextStepBtn = screen.getByText(i < 4 ? 'Next' : 'Create');
      fireEvent.click(nextStepBtn);
    }

    expect(document.body).toMatchSnapshot();
  });
});
