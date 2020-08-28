class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    if (status) {
      this.status = status;
    }
  }
}

module.exports = ApiError;
