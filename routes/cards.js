const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const urlReg = require('../validation__modules/urlReg');

// получить все карточки
router.get('/cards', getCards);

// добавить карточку
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlReg),
  }),
}), createCard);

// удалить карточку
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

// поставить лайк
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

// убрать лайк
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
