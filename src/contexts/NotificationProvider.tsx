import React, { type ReactNode, useState } from 'react';
import { AlertActionLink } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { v4 as uuid } from 'uuid';
import type { Notification, NotificationOptions, NotificationVariant } from '../hooks/types';

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (
    variant: NotificationVariant,
    message: string,
    options?: NotificationOptions
  ) => string;
  removeNotification: (key: string) => void;
}

const NotificationContext = React.createContext<NotificationContextValue>({
  notifications: [],
  addNotification: () => '',
  removeNotification: () => undefined
});

const NotificationProvider = ({ children }: { children?: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const buildNotificationProps = (
    variant: NotificationVariant,
    message: string,
    options?: NotificationOptions
  ): Notification => {
    const notificationKey = uuid();
    const notificationProps: Notification = {
      variant: variant,
      message: message,
      key: notificationKey,
      timeout: options?.hasTimeout ?? true,
      description: options?.description
    };

    if (options && options.alertLinkText && options.alertLinkHref) {
      const linkAttributes = options.alertLinkIsDownload ? { download: '' } : {};
      const alertLink = (
        <>
          <AlertActionLink>
            <a href={options.alertLinkHref} {...linkAttributes}>
              {options.alertLinkText}
            </a>
          </AlertActionLink>
        </>
      );
      notificationProps.actionLinks = alertLink;
    }

    if (options && options.alertLinkIsDownload && options.alertLinkHref) {
      notificationProps.downloadHref = options.alertLinkHref;
    }

    return notificationProps;
  };

  const addNotification = (
    variant: NotificationVariant,
    message: string,
    options?: NotificationOptions
  ): string => {
    const newNotificationProps = buildNotificationProps(variant, message, options);

    let newNotifications = [...notifications, { ...newNotificationProps }];

    if (options && options.keyOfAlertToReplace) {
      newNotifications = newNotifications.filter(
        (notification) => notification.key !== options.keyOfAlertToReplace
      );
    }

    setNotifications(newNotifications);
    return newNotificationProps.key;
  };

  const removeNotification = (key: string) => {
    setNotifications(notifications.filter((notification) => notification.key !== key));
  };

  const contextValue: NotificationContextValue = {
    notifications,
    addNotification: (variant, message, options) => {
      return addNotification(variant, message, options);
    },
    removeNotification: (key) => removeNotification(key)
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider as default };
