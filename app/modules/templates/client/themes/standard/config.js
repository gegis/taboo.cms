module.exports = {
  name: 'standard',
  title: 'Standard',
  description: 'Standard Template',
  settings: {
    headerLogo: '/images/logo.png',
    headerColor: '#ffffff',
    backgroundColor: '#ffffff',
    footerColor: '#142a3e',
  },
  languageSettings: {
    en: {
      headerNavigation: 'website',
      headerNavigationAuthenticated: 'user',
      footerNavigation: 'website',
      footerNavigationAuthenticated: 'website',
      footerCopyright: '&copy; All rights reserved. 2020',
    },
  },
  default: true,
  style: '',
  styleTemplate: `
    body {
      font-size: 16px;
    }
    .rs-btn-primary {
      background-color: {{headerColor}};
    }
    .rs-btn-primary:not(.rs-btn-disabled):hover {
      background-color: {{footerColor}};
    }
   `,
};
