const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch((next));
};

// добавить карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((next));
};

// удалить карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить эту карточку потому что ее может удалить только владелец');
      } else {
        card.remove()
          .then((removedCard) => {
            res.send({ message: 'Эта карточка была удалена', removedCard });
          });
      }
    })
    .catch((next));
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.send({ data: card });
      }
    })
    .catch((next));
};

// убрать лайк у карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Нет карточки с таким id');
      } else {
        res.send({ data: card });
      }
    })
    .catch((next));
};