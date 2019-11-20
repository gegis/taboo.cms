import { decorate, observable, action } from 'mobx';

class NotificationsStore {
  constructor() {
    this.notifications = [];
  }

  push({
    message,
    type = 'info',
    sticky = false,
    translate = false,
    html = null,
    title = null,
    duration = null,
    translationVars = {},
  }) {
    this.notifications.push({ message, type, sticky, translate, html, title, duration, translationVars });
  }

  shift() {
    let notification = null;
    if (this.notifications.length > 0) {
      notification = this.notifications.shift();
    }
    return notification;
  }
}

decorate(NotificationsStore, {
  notifications: observable,
  push: action,
  shift: action,
});

export default NotificationsStore;
