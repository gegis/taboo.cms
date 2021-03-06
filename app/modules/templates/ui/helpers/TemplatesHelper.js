import SocketsClient from 'modules/core/ui/helpers/SocketsClient';
const { version } = window.app.config;

class TemplatesHelper {
  constructor() {
    this.changesTimeout = null;
    this.changesTimeoutDelay = 300;
    this.emitTemplateChanges = this.emitTemplateChanges.bind(this);
  }

  getTemplate(name, { templatesStore }) {
    const { templateComponents = {}, defaultTemplateName = 'standard' } = templatesStore;
    if (templateComponents[name]) {
      return templateComponents[name];
    }
    // TODO show loading rather than loading standard template
    return templateComponents[defaultTemplateName];
  }

  getDefaultTemplate({ templatesStore }) {
    const { templateComponents = {}, defaultTemplateName = 'standard' } = templatesStore;
    return templateComponents[defaultTemplateName];
  }

  preloadTemplate(name, { templatesStore }) {
    templatesStore.loadTemplate(name);
  }

  getTemplatePreviewReceiveEventName({ authStore, templatesStore }) {
    let eventName = null;
    if (authStore.user && authStore.user.id) {
      eventName = templatesStore.templatePreviewReceivePattern.replace('{userId}', authStore.user.id);
    }
    return eventName;
  }

  emitTemplateChanges({ authStore, templatesAdminStore }) {
    clearTimeout(this.changesTimeout);
    this.changesTimeout = setTimeout(() => {
      SocketsClient.emit(templatesAdminStore.templatePreviewEmit, {
        user: authStore.user,
        template: templatesAdminStore.item,
      });
    }, this.changesTimeoutDelay);
  }

  loadLibStylesheet(name) {
    const stylesheet = document.getElementById('theme-lib-stylesheet');
    const stylesheetHref = `/css/${name}/lib.css?v=${version}`;
    if (stylesheet && stylesheet.href.indexOf(stylesheetHref) === -1) {
      stylesheet.href = stylesheetHref;
    }
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
