class Countries {
  get(next) {
    $.ajax({
      type: 'GET',
      url: '/api/countries',
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new Countries();
