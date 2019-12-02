class Page {
  get(url, next) {
    $.ajax({
      type: 'GET',
      url: `/api/pages?url=${encodeURI(url)}`,
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new Page();
