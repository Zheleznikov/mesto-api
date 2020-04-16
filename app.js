/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const config = require('./config');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors());

// подключение к монго
mongoose.connect(config.CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// лог запросов
app.use(requestLogger);

app.use('/', require('./routes/crashTest')); // CRASH TEST - REMOVE AFTER ALL!!
app.use('/', require('./routes/sign'));
app.use('/', auth, require('./routes/users'));
// app.use('/', require('./routes/users'));
app.use('/', auth, require('./routes/cards'));
// app.use('/', require('./routes/cards'));

app.use((req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

// лог ошибок
app.use(errorLogger);
app.use(errors());

// собираем все ошибки
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});