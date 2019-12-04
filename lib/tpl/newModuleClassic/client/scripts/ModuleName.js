class ModuleName {
  get(next) {
    $.ajax({
      type: 'GET',
      url: '/api/moduleName',
      success: function(data) {
        next(null, data);
      },
      error: function(err) {
        next(err);
      },
    });
  }
}

export default new ModuleName();
