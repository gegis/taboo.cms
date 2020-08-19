module.exports = [
  {
    _id: '5ee37cec68be45182b3a0ad4',
    variablesList: [],
    action: 'passwordReset',
    language: 'en',
    from: 'Taboo Solutions <noreply@taboo.solutions>',
    subject: 'Password Reset',
    body: `<p>Hi {{username}},</p><p>We have successfully received your request to reset the password</p><p>If you want
to reset your password please follow the link:</p><p>{{resetLink}}</p><p>If you have not requested for the 
password reset, please contact us as soon as possible.</p>
<p>Kind Regards,<br />Taboo Solutions Team.<br />
<a href="https://www.taboo.solutions" style="text-decoration: none"><span style="color:#3498db;">
<small>www.taboo.solutions</small></span></a></p>`,
  },
  {
    _id: '5ee3814b68be45182b3a0ad7',
    variablesList: [],
    action: 'accountVerification',
    language: 'en',
    from: 'Taboo Solutions <noreply@taboo.solutions>',
    subject: 'Account Verification',
    body: `<p>Hi {{username}},</p><p>Please verify your email by clicking on the link below:</p><p>{{verifyLink}}</p>
<p>Kind Regards,<br />Taboo Solutions Team.<br />
<a href="https://www.taboo.solutions" style="text-decoration: none"><span style="color:#3498db;">
<small>www.taboo.solutions</small></span></a></p>`,
  },
  {
    _id: '5ef9f1a29d8bcd4a41af5e04',
    action: 'reportedPost',
    language: 'en',
    from: 'Taboo Solutions <noreply@taboo.solutions>',
    subject: 'Reported Post',
    body: `<p>You have a new reported post:</p><p>{{postLink}}</p>
<p>Kind Regards,<br />Taboo Solutions Team.<br />
<a href="https://www.taboo.solutions" style="text-decoration: none"><span style="color:#3498db;">
<small>www.taboo.solutions</small></span></a></p>`,
  },
];
