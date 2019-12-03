class Loader {
  show(selector) {
    if (!selector) {
      selector = '#main-loader';
    }
    $(selector).show();
  }

  hide(selector) {
    if (!selector) {
      selector = '#main-loader';
    }
    $(selector).hide();
  }
}

export default new Loader();
