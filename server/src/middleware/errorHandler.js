function getHttpStatus(error) {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return 400;
  }

  if (error.code === 11000) {
    return 409;
  }

  const status = error.statusCode || error.status;
  return Number.isInteger(status) && status >= 400 && status < 600
    ? status
    : 500;
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = getHttpStatus(error);

  if (status >= 500) {
    console.error("Request failed:", error.message);
  }

  const message =
    status >= 500 ? "Internal server error" : error.message;

  return res.status(status).json({ message });
}

export { errorHandler, getHttpStatus };
