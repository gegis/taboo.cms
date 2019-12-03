class UserActions {
  login(email, pass, next) {
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: {
        email: email,
        password: pass,
      },
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }

  register(data, next) {
    $.ajax({
      type: 'POST',
      url: '/api/users/register',
      data: data,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }

  updateMyProfile(data, next) {
    $.ajax({
      type: 'PUT',
      url: '/api/users/current',
      data: data,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }

  logOut(next) {
    $.ajax({
      type: 'GET',
      url: '/api/logout',
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }

  resetPassword(email, next) {
    $.ajax({
      type: 'POST',
      url: '/api/reset-password',
      data: {
        email: email,
      },
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }

  changePassword(data, next) {
    $.ajax({
      type: 'POST',
      url: '/api/change-password',
      data: data,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new UserActions();
