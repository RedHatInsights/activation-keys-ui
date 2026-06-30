import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Authentication from './Components/Authentication/Authentication';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

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

const AppEntry = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessCheck.Provider
        baseUrl={window.location.origin}
        apiPath="/api/kessel/v1beta2"
      >
        <Authentication>
          <App />
        </Authentication>
      </AccessCheck.Provider>
    </QueryClientProvider>
  );
};

export default AppEntry;
