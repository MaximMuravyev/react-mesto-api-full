const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlCorrect = require('../config/url-config');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUser);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }),
  }),
}), getUser);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .pattern(urlCorrect)
      .messages({ 'string.pattern.base': 'Invalid URL' }),
  }),
}), updateAvatar);

module.exports = router;
