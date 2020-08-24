module.exports = {
  port: 3000,
  verificationStatuses: ['new', 'pending', 'failed', 'approved'],
  userDocumentNames: ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'],
  settingsTypes: ['string', 'integer', 'float', 'json', 'boolean'],
  userPasswordMinLength: 8,
  usersSignInEnabled: true,
  usersSignUpEnabled: true,
  languages: [
    { code: 'en', title: 'English' },
    // { code: 'it', title: 'Italian' },
  ],
  maxFileSize: 1024 * 1024 * 500,
  userMaxFileSize: 1024 * 1024 * 10,
  userMaxGifFileSize: 1024 * 1024 * 5,
  templates: {
    socketsEvents: {
      templatePreviewEmit: 'template-preview-emit',
      templatePreviewReceive: 'template-preview-receive-{userId}',
    },
    defaultTemplate: 'standard',
    previewRoute: '/:language?/templates/preview/:template',
    themesPath: 'app/themes',
  },
  formTemplates: {
    contactUs: {
      title: 'Contact Us',
      requestTypes: [
        {
          label: 'Generic',
          value: 'Generic',
        },
        {
          label: 'Request a callback',
          value: 'Request a callback',
        },
        {
          label: 'Customer Support',
          value: 'Customer Support',
        },
      ],
      conditionalRecipients: [
        {
          formField: 'requestType',
          fieldValue: 'Generic',
          recipients: '',
        },
        {
          formField: 'requestType',
          fieldValue: 'Request a callback',
          recipients: '',
        },
        {
          formField: 'requestType',
          fieldValue: 'Customer Support',
          recipients: '',
        },
      ],
    },
  },
};
