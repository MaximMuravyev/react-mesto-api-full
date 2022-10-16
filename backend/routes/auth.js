const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const { urlCorrect } = require('../config/url-config');
const ErrorNotFound = require('../errors/ErrorNotFound');

const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
    avatar: Joi.string()
      .custom(urlCorrect),
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
  }),
}), createUser);

router.use('/users', auth, routerUsers);
router.use('/cards', auth, routerCards);

router.use('*', auth, (req, res, next) => {
  next(ErrorNotFound('Страница не существует'));
});

module.exports = router;
