/* eslint-disable max-len */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');


const { NODE_ENV, JWT_SECRET } = process.env;


// получить всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .populate({ path: 'cards', model: Card })
    .then((users) => res.send({ data: users }))
    .catch((err) => next({ message: err.message }));
};

// получить данные о пользователе по id
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch((err) => next({ message: err.message }));
};

// получить данные о себе
module.exports.getSigninUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ data: user });
    })
    .catch((err) => next({ message: err }));
};

// отправить данные о себе
module.exports.postMe = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => res.send({ message: 'ok' }))
    .catch((err) => next(new BadRequestError(err.message)));
};

// создать пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        message: 'Congratulate',
      });
    })
    .catch((err) => next(new BadRequestError(`Данные не прошли валидацию: ${err.message}`)));
};

// залогиниться
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user.email) {
        throw new NotFoundError('Такого пользователя нет');
      }
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch((err) => next(new UnauthorizedError(`Неудачная авторизация: ${err.message}`)));
};

// выйти
module.exports.logout = (req, res, next) => { // ??
  User.findById(req.user._id)
    .then(() => {
      // const token = req.headers.authorization;
      res.send({ message: 'logout' });
    })
    .catch((err) => next({ message: err }));
};


// изменить информацию о пользователе (о себе)
module.exports.updateMyProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new BadRequestError(err.message)));
};

// изменить аватар пользователя (себя)
module.exports.updateMyAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new BadRequestError(err.message)));
};