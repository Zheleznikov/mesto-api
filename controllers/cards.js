const Card = require('../models/card');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate({ path: 'owner', model: User })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next({ message: err.message }));
};


// добавить карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // console.log(req.user._id);

  Card.create({ name, link, owner: req.user._id })
    .populate({ path: 'owner', model: User })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => next({ message: err.message }));
  console.log(req.user._id);
};

// module.exports.test = (req, res, next) => {
//   User.findByIdAndUpdate(req.user._id, { $addToSet: { cards: Card } }, { new: true })
//     .orFail(() => new NotFoundError('Нет пользователя с таким id'))
//     .then((card) => res.send({ data: card }))
//     .catch((err) => next({ message: err.message }))
//     .next();
// };


// удалить карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить эту карточку потому что ее может удалить только владелец');
      }
      card.remove()
        .then((removedCard) => res.send({ message: 'Эта карточка была удалена', removedCard }));
    })
    .catch((err) => next({ message: err.message }));
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next({ message: err.message }));
};

// убрать лайк у карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next({ message: err.message }));
};