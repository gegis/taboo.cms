module.exports = {
  environment: 'development',
  server: {
    port: 3000,
    uploads: {
      uploadsDir: 'public/uploads',
      urlPath: '/uploads',
      allowedTypes: [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
        'video/webm',
        'video/mp4',
        'video/x-matroska',
        'application/pdf',
      ],
    },
  },
  client: {
    locale: 'en-GB',
  },
};
