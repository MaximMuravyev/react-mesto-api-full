const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authRouter);

app.use('/cards', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use((req, res, next) => next(new ErrorNotFound('Неправильный маршрут')));
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, (error) => {
  // eslint-disable-next-line no-unused-expressions, no-console
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});
