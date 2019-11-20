import React from 'react';
import { Notification } from 'rsuite';
import StringHelper from 'app/modules/core/client/helpers/StringHelper';

class NotificationsHelper {
  handleNotifications(notificationsStore, localeStore) {
    let notification;
    let notificationOptions = {
      title: '',
      description: '',
      duration: 5000,
    };
    if (notificationsStore.notifications.length > 0) {
      notification = notificationsStore.shift();
      notificationOptions.title = StringHelper.capitalizeFirstLetter(notification.type);

      if (notification.title) {
        notificationOptions.title = notification.title;
      }

      if (notification.translate) {
        notificationOptions.title = localeStore.getTranslation(notificationOptions.title);
        if (notification.html) {
          notificationOptions.description = (
            <span
              dangerouslySetInnerHTML={{
                __html: localeStore.getTranslation(notification.html, notification.translationVars),
              }}
            />
          );
        } else {
          notificationOptions.description = localeStore.getTranslation(notification.message);
        }
      } else if (notification.html) {
        notificationOptions.description = <span dangerouslySetInnerHTML={{ __html: notification.html }} />;
      } else {
        notificationOptions.description = notification.message;
      }

      if (notification.duration) {
        notificationOptions.duration = notification.duration;
      }

      if (notification.sticky) {
        notificationOptions.duration = 0;
      }

      if (Object.prototype.hasOwnProperty.call(Notification, notification.type)) {
        Notification[notification.type](notificationOptions);
      }
    }
  }
}

export default new NotificationsHelper();
