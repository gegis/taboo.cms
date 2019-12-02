class Settings {
  get(key, next) {
    $.ajax({
      type: 'GET',
      url: '/api/settings/' + key,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new Settings();
