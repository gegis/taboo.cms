class TemplatesHelper {
  preloadTemplate(name, templatesStore) {
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
}

export default new TemplatesHelper();
