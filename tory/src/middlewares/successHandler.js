export const successHandler = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    isSuccess: true,
    code: statusCode,
    message,
    data,
  });
};