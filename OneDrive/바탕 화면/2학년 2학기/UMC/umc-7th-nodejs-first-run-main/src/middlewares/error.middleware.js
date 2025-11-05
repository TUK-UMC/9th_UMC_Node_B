export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err.message);

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "서버 내부 오류가 발생했습니다.",
  });
};