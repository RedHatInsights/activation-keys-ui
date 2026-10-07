import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationProvider';
import type { NotificationOptions } from './types';

const useNotifications = () => {
  const { notifications, addNotification, removeNotification } = useContext(NotificationContext);

  const addSuccessNotification = (message: string, options?: NotificationOptions) => {
    return addNotification('success', message, options);
  };

  const addErrorNotification = (message: string, options?: NotificationOptions) => {
    return addNotification('danger', message, options);
  };

  const addInfoNotification = (message: string, options?: NotificationOptions) => {
    return addNotification('info', message, options);
  };

  return {
    notifications,
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    removeNotification
  };
};

export default useNotifications;
