export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace with validated and sanitized data
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (error) {
    const issues = error.errors?.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') || error.message;
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: `Invalid input: ${issues}`,
      },
    });
  }
};
