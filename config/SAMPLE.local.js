module.exports = {
  environment: 'development',
  debug: true,
  server: {
    port: 3000,
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
