const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secretkey',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

function signToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  jwtConfig,
  signToken,
  verifyToken,
};