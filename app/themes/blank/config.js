module.exports = {
  name: 'blank',
  title: 'Blank',
  description: 'Blank Template',
  settings: {
    primaryColor: '#25a4dd',
    primaryColorActive: '#1288c7',
    buttonTextColor: '#ffffff',
    textColor: '#575757',
    backgroundColor: '#ffffff',
  },
  languageSettings: {
    en: {},
  },
  default: false,
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
   `,
};
