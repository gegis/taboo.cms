module.exports = [
  {
    category: 'generic',
    type: 'json',
    public: true,
    key: 'clientConfig',
    value: `{
  "metaTitle": "Taboo CMS",
  "templates": {
    "defaultTemplate": "standard"
  },
  "dateFormat": "DD/MM/YYYY",
  "dateTimeFormat": "DD/MM/YYYY HH:mm:ss"
}`,
  },
  {
    _id: '5ee40d9355b1a952dc2df399',
    category: 'generic',
    type: 'string',
    public: false,
    key: 'verifyEmailRedirectSuccess',
    value: '/verify-email/success',
  },
  {
    _id: '5ee40db755b1a952dc2df39a',
    category: 'generic',
    type: 'string',
    public: false,
    key: 'verifyEmailRedirectError',
    value: '/verify-email/error',
  },
  {
    _id: '5ef5eb5188c7484b2fcb3adb',
    category: 'generic',
    type: 'string',
    public: true,
    key: 'verifyEmailNotification',
    value: 'Please check your email inbox to verify email address.',
  },
  {
    _id: '5f3e8ab98caa9c4ffb29b930',
    category: 'generic',
    type: 'string',
    public: true,
    key: 'verifyDocsNotification',
    value: 'Please verify your account by uploading requested documents.',
  },
  {
    _id: '5f04808833b66355cbd29b3b',
    category: 'generic',
    type: 'string',
    public: false,
    key: 'accountDeactivationEmailRecipients',
    value: 'support@taboo.solutions',
  },
];
