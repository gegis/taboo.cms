class Navigation {
  get(type, next) {
    $.ajax({
      type: 'GET',
      url: '/api/navigation/' + type,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new Navigation();
