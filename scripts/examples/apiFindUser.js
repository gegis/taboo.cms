const axios = require('axios');
const config = {
  host: 'http://localhost:3000',
  user: {
    email: 'test@test.test',
    pass: 'test',
  },
};

axios
  .post(`${config.host}/api/login`, { email: config.user.email, password: config.user.pass })
  .then(response => {
    const cookies = response.headers['set-cookie'];
    axios
      .get(`${config.host}/api/admin/users/USERID`, {
        headers: {
          Cookie: cookies.join(';'),
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e.response.data);
      });
  })
  .catch(e => {
    console.log(e.response.data);
  });
