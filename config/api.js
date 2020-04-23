module.exports = {
  routePrefix: '/api',
  authorization: {
    type: {
      apiKeyName: 'ApiKey',
    },
  },
  defaultPageSize: 50,
  reservations: {
    defaultSort: { createdAt: 'desc' },
  },
  pages: {
    defaultSort: { title: 'asc' },
  },
  galleries: {
    defaultSort: { createdAt: 'desc' },
  },
  uploads: {
    defaultSort: { createdAt: 'desc' },
  },
  users: {
    defaultSort: { createdAt: 'desc' },
  },
  roles: {
    defaultSort: { name: 'asc' },
  },
  navigation: {
    defaultSort: { name: 'asc' },
  },
  settings: {
    defaultSort: { key: 'asc' },
  },
  logsApi: {
    defaultSort: { createdAt: 'desc' },
  },
};
