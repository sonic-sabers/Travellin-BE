export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};

const errorMiddleware = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  console.error('Error:', error);

  res.status(status).json({
    success: false,
    status,
    message,
  });
};

export default errorMiddleware;
