export const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
const errorMiddleware = (error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
};
export default errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map