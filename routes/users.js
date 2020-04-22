const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, getCurrentUser, updateMyProfile, updateMyAvatar, getMyData } = require('../controllers/users');


const urlReg = require('../validation__modules/urlReg');
const auth = require('../middlewares/auth');

// получить всех пользователей
router.get('/users', getUsers);

// получить кого-то одного
router.get('/users/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getCurrentUser);

// получить информацию о себе
router.get('/me', auth, getSigninUser);

// обновить информацию о себе
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateMyProfile);

// обновить аватарку свою
router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlReg),
  }),
}), updateMyAvatar);





module.exports = router;
