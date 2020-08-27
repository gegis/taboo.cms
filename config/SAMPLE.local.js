const shared = require('./shared');

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.PORT || shared.port,
    secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],
    cache: {
      enabled: false,
    },
  },
  auth: {
    jwt: {
      secret: 'REPLACE-ME-123456789',
    },
  },
  mailer: {
    enabled: true,
    // If using nodemailer
    nodemailer: {
      transporter: {
        service: 'gmail', // or 'smtp' or 'sendmail'
        auth: {
          user: 'YOUR-EMAIL',
          pass: 'YOUR-3RD-PARTY-APP-PASS',
        },
      },
    },
    // If using SendGrid
    // sendGrid: {
    //   apiKey: '',
    // },
  },
};
