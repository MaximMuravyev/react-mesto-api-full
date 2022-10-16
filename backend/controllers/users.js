const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const RequestError = require('../errors/RequestError');
const User = require('../models/users');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('Не найдено'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.message === 'Не найдено') {
        next(new ErrorNotFound('Некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound('Некорректный id'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidDataError('Некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user.toObject()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new RequestError('Данный email уже используется'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Некорректные данные'));
      }
      if (err.name === 'CastError') {
        return next(new ErrorNotFound('Некорректный id'));
      }
        return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Некорректные данные'));
      }
      if (err.name === 'CastError') {
        return next(new ErrorNotFound('Некорректный id'));
      }
        return next(err);
    });
};
