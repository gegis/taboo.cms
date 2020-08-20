module.exports = [
  {
    _id: '5f3e63f993c42f7f3a0535b4',
    enabled: true,
    title: 'Contact Us',
    recipients: 'info@taboo.solutions',
    conditionalRecipients: [
      { _id: '5f3e63f993c42f7f3a0535b5', formField: 'requestType', fieldValue: 'Customer support', recipients: '' },
      { _id: '5f3e63f993c42f7f3a0535b6', formField: 'requestType', fieldValue: 'Business stuff', recipients: '' },
    ],
    header: `<div style="text-align: center;">
<span style="font-size:18px;"><br /><br />Don&amp;t hesitate to drop us a message or request a callback.</span>
<br /><br />&nbsp;</div>`,
    footer: '',
    template: 'contactUs',
    createdAt: '2020-08-20T11:52:25.830Z',
    updatedAt: '2020-08-20T12:04:01.223Z',
    __v: 0,
  },
];
