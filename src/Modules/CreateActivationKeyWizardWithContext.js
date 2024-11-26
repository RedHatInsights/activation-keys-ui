import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init, RegistryContext } from '../store';
import logger from 'redux-logger';
import Authentication from '../Components/Authentication';
import CreateActivationKeyWizard from '../Components/Modals/CreateActivationKeyWizard';

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
  const registry = IS_DEV ? init(logger) : init();
  return (
    <QueryClientProvider client={queryClient}>
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <Authentication>
            <CreateActivationKeyWizard {...props} />
          </Authentication>
        </Provider>
      </RegistryContext.Provider>
    </QueryClientProvider>
  );
};

export default CreateActivationKeyWizardWithContext;
