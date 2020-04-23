import SocketsClient from 'modules/core/ui/helpers/SocketsClient';
const { version } = window.app.config;

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
    const stylesheetHref = `/css/${name}/index.css?v=${version}`;
    if (stylesheet && stylesheet.href.indexOf(stylesheetHref) === -1) {
      stylesheet.href = stylesheetHref;
    }
  }

  loadStyle({ templatesStore }) {
    const styleTag = document.getElementById('theme-style');
    if (styleTag) {
      const { style } = templatesStore;
      if (style && styleTag.innerHTML !== style) {
        styleTag.innerHTML = style;
      } else if (!style) {
        styleTag.innerHTML = '';
      }
    }
  }
}

export default new TemplatesHelper();