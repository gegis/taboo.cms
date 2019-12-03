class Notifications {
  show(message, type = 'info', delay = 5000) {
    const toast = this.getToast(message, type, delay);
    $('.toast-notifications').prepend(toast);
    toast.toast('show');
  }

  getToast(message, type = 'info', delay = 5000) {
    let header = 'Message';
    let headerClass = '';
    if (type === 'error') {
      header = 'Error';
      headerClass = 'text-danger';
    }
    return $(`<div class="toast notification" data-autohide="true" data-delay="${delay}">
      <div class="toast-header ${headerClass}">
        <i class="fa fa-exclamation-circle rounded mr-2 "></i>
        <strong class="mr-auto">${header}</strong>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>`);
  }
}

export default new Notifications();
