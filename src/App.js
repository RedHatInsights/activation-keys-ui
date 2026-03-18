import React, { useEffect } from 'react';
import AppRoutes from './Routes';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './Components/Notifications';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const App = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, []);

  return (
    <>
      <NotificationProvider>
        <Notifications />
        <AppRoutes />
      </NotificationProvider>
    </>
  );
};
export default App;
