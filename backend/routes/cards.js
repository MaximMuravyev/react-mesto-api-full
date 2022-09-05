const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlCorrect = require('../config/url-config');

const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);

router.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    link: Joi.string()
      .pattern(urlCorrect)
      .default('https://i.pinimg.com/originals/99/28/5c/99285cf001991937165a765f2279316b.jpg')
      .messages({ 'string.pattern.base': 'Invalid URL' })
      .required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }),
  }),
}), dislikeCard);

module.exports = router;
