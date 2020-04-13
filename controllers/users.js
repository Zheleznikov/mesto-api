require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;


// получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Что-то с сервером...' }));
};

// получить пользователя по id
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Не найден пользователь с таким id' });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении пользователя' }));
};

// создать пользователя
module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => res.status(400).send(err));
};


// залогиниться
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        sameSite: true,
      }).send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// изменить информацию о пользователе (обо мне)
module.exports.updateMyProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при изменении информации пользователя' }));
};

// изменить аватар пользователя (меня)
module.exports.updateMyAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при изменении аватара' }));
};