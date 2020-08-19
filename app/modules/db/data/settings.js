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
    key: 'verifyAccountRedirectSuccess',
    value: '/verify-account/success',
  },
  {
    _id: '5ee40db755b1a952dc2df39a',
    category: 'generic',
    type: 'string',
    public: false,
    key: 'verifyAccountRedirectError',
    value: '/verify-account/error',
  },
  {
    _id: '5ef5eb5188c7484b2fcb3adb',
    category: 'generic',
    type: 'string',
    public: true,
    key: 'verifyAccountNotification',
    value: 'Please check your email inbox to verify the account.',
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
