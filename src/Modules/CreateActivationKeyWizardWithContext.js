import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Authentication from '../Components/Authentication';
import ActivationKeyWizard from '../Components/Modals/ActivationKeyWizard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 10 * 1000,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const CreateActivationKeyWizardWithContext = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Authentication>
        <ActivationKeyWizard {...props} />
      </Authentication>
    </QueryClientProvider>
  );
};

export default CreateActivationKeyWizardWithContext;
