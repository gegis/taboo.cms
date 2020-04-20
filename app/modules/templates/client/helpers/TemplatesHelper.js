import SocketsClient from 'modules/core/client/helpers/SocketsClient';

class TemplatesHelper {
  constructor() {
    this.changesTimeout = null;
    this.changesTimeoutDelay = 300;
    this.emitTemplateChanges = this.emitTemplateChanges.bind(this);
  }

  preloadTemplate(name, { templatesStore }) {
    templatesStore.loadTemplate(name);
  }

  preloadNavigation(name, { authStore, templatesStore, navigationStore }) {
    if (authStore.authenticated && authStore.user) {
      navigationStore.loadByName(templatesStore.languageSettings.headerNavigationAuthenticated);
      navigationStore.loadByName(templatesStore.languageSettings.footerNavigationAuthenticated);
    } else {
      navigationStore.loadByName(templatesStore.languageSettings.headerNavigation);
      navigationStore.loadByName(templatesStore.languageSettings.footerNavigation);
    }
  }

  getTemplatePreviewReceiveEventName({ authStore, templatesStore }) {
    let eventName = null;
    if (authStore.user && authStore.user.id) {
      eventName = templatesStore.templatePreviewReceivePattern.replace('{userId}', authStore.user.id);
    }
    return eventName;
  }

  emitTemplateChanges({ authStore, templatesStore }) {
    clearTimeout(this.changesTimeout);
    this.changesTimeout = setTimeout(() => {
      SocketsClient.emit(templatesStore.templatePreviewEmit, { user: authStore.user, template: templatesStore.item });
    }, this.changesTimeoutDelay);
  }

  loadStylesheet(name) {
    const stylesheet = document.getElementById('theme-stylesheet');
    if (stylesheet) {
      stylesheet.href = `/css/${name}/styles/index.css`;
    }
  }
}

export default new TemplatesHelper();
