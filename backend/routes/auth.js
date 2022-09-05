const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlCorrect = require('../config/url-config');

const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
  }),
}), login);

router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
    avatar: Joi.string()
      .pattern(urlCorrect)
      .allow('', null)
      .empty(['', null])
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .messages({ 'string.pattern.base': 'Invalid URL' }),
    name: Joi.string()
      .min(2)
      .max(30)
      .allow('', null)
      .empty(['', null])
      .default('Жак-Ив Кусто'),
    about: Joi.string()
      .min(2)
      .max(30)
      .allow('', null)
      .empty(['', null])
      .default('Исследователь'),
  }),
}), createUser);

module.exports = router;
