module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // Postgres error codes
  if (err.code === '23505') return res.status(409).json({ message: 'Record already exists' });
  if (err.code === '23503') return res.status(400).json({ message: 'Related record does not exist' });
  if (err.code === '23514') return res.status(400).json({ message: 'Invalid value supplied' });

  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
  });
};
