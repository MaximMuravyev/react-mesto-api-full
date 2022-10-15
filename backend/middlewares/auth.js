const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('jwt=')) {
    next(new AuthError('Авторизуйтесь'));
  } else {
    const token = authorization.replace('jwt=', '');
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      throw new AuthError('Авторизуйтесть');
    }

    req.user = payload;
    next();
  }
};
