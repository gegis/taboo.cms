module.exports = {
  routePrefix: '/api',
  authorization: {
    apiKeyName: 'ApiKey',
    apiKeyExpiresIn: 1000 * 60 * 60 * 24 * 365, // time in ms
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
