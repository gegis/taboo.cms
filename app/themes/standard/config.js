module.exports = {
  name: 'standard',
  title: 'Standard',
  description: 'Standard Template',
  settings: {
    headerLogo: '/images/_shared/logo.png',
    headerColor: '#ffffff',
    headerTextColor: '#575757',
    footerColor: '#142a3e',
    footerTextColor: '#ffffff',
    primaryColor: '#25a4dd',
    primaryColorActive: '#1288c7',
    buttonTextColor: '#ffffff',
    textColor: '#575757',
    backgroundColor: '#ffffff',
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
    body,
    .main-content {
      background-color: {{backgroundColor}};
      color: {{textColor}};
    }
    a {
      color: {{primaryColor}};
    }
    .rs-btn-primary {
      color: {{buttonTextColor}};
      background-color: {{primaryColor}};
    }
    a:hover {
      color: {{primaryColorActive}};
    }
    .rs-btn-primary:not(.rs-btn-disabled):hover {
      background-color: {{primaryColorActive}};
    }
    .header,
    .header .rs-btn-subtle,
    .header .rs-nav-item-content,
    .header .rs-dropdown-menu,
    .header .rs-dropdown-menu .rs-dropdown-item-content {
      background-color: {{headerColor}};
      color: {{headerTextColor}};
    }
    .footer,
    .footer .rs-btn-subtle,
    .footer .rs-nav-item-content,
    .footer .rs-dropdown-menu,
    .footer .rs-dropdown-menu .rs-dropdown-item-content {
      background-color: {{footerColor}};
      color: {{footerTextColor}};
    }
   `,
};
