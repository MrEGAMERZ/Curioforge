export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // Do not expose stack traces or raw upstream internal errors
  console.error(`[CurioForge Error] [${code}] ${req.method} ${req.url}:`, err.message);

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    },
  });
};
