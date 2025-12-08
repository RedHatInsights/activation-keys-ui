import React from 'react';
import AppRoutes from './Routes';
import NotificationProvider from './contexts/NotificationProvider';
import Notifications from './Components/Notifications';

const App = () => {
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
