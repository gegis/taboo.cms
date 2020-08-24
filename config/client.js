const shared = require('./shared');

module.exports = {
  admin: {
    language: 'en',
    locale: 'en-gb',
  },
  language: 'en',
  locale: 'en-gb',
  languages: shared.languages,
  dateFormat: 'DD/MM/YYYY',
  dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
  mobileBreakpoint: 767,
  metaTitle: 'Taboo CMS',
  userACLRefreshThreshold: 1000 * 60 * 5,
  userInfoUpdateInterval: 1000 * 60,
  userVerificationStatuses: shared.verificationStatuses,
  userDocumentNames: shared.userDocumentNames,
  userPasswordMinLength: shared.userPasswordMinLength,
  usersSignInEnabled: shared.usersSignInEnabled,
  uploads: {
    userMaxFileSize: shared.userMaxFileSize,
    userMaxGifFileSize: shared.userMaxGifFileSize,
  },
  gaId: '',
  gtag: '',
  cookiesAlert: {
    text: 'We use cookies to ensure you get the best experience on our website.',
    learnMoreLink: 'https://cookiesandyou.com/',
  },
  templates: shared.templates,
  settings: {
    types: shared.settingsTypes,
  },
  formTemplates: shared.formTemplates,
};
