function buildErrorResponse(error) {
  if (!error) {
    return { statusCode: 500, body: { error: 'Internal server error' } };
  }

  if (error instanceof SyntaxError && Object.prototype.hasOwnProperty.call(error, 'body')) {
    return { statusCode: 400, body: { error: 'Invalid JSON payload' } };
  }

  if (error.code === '23505') {
    return { statusCode: 409, body: { error: 'Resource already exists' } };
  }

  if (error.code === '23503') {
    return { statusCode: 409, body: { error: 'Related resource does not exist' } };
  }

  if (error.code === '23502') {
    return { statusCode: 400, body: { error: 'A required field is missing' } };
  }

  if (error.code === '22P02') {
    return { statusCode: 400, body: { error: 'Invalid input format' } };
  }

  if (typeof error.statusCode === 'number' && error.message) {
    return {
      statusCode: error.statusCode,
      body: { error: error.message },
    };
  }

  return { statusCode: 500, body: { error: 'Internal server error' } };
}

function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const response = buildErrorResponse(error);
  return res.status(response.statusCode).json(response.body);
}

module.exports = errorHandler;