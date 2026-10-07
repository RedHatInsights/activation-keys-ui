import React, { type ReactElement, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import pckg from '../package.json';
import ActivationKey from './Components/ActivationKey/ActivationKey';
const { routes: paths } = pckg;

const ActivationKeys = lazy(() => import('./Components/ActivationKeys'));

interface SuspenseWrappedProps {
  children: ReactElement;
}

const SuspenseWrapped = ({ children }: SuspenseWrappedProps) => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={paths.activationKey}
        element={
          <SuspenseWrapped>
            <ActivationKey />
          </SuspenseWrapped>
        }
      />
      <Route
        path={paths.activationKeys}
        element={
          <SuspenseWrapped>
            <ActivationKeys />
          </SuspenseWrapped>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
