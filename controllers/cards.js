const Card = require('../models/card');
// const NotFoundError = require('../errors/notFoundError');

// получить все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Что-то не так на сервере...' }));
};

// добавить карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при добавлении карточки' }));
};

// удалить карточку
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Не найдена карточка с таким id' });
      } else if (String(card.owner) !== req.user._id) {
        res.status(403).send({ message: 'нельзя удалить эту карточку потому что ее может удалить только владелец' });
      } else {
        card.remove()
          .then((removedCard) => {
            res.send({ message: 'Эта карточка была удалена', removedCard });
          });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при удалении карточки' }));
};

// удалить карточку orFail()
// module.exports.deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .orFail(new NotFoundError('Не найдена карточка с таким id'))
//     .then((card) => res.send({ data: card }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка при удалении карточки' }));
// };

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Не найдена карточка с таким id' });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// убрать лайк у карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Не найдена карточка с таким id' });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};