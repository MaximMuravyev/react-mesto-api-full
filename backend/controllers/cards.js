const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const Cards = require('../models/card');

module.exports.getCard = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(new ErrorNotFound('Не найдено'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы не можете это сделать'));
      } else {
        Cards.findByIdAndRemove(req.params.cardId)
          .then(() => res.send(card))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidDataError('ПНекорректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        next(new ErrorNotFound('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
