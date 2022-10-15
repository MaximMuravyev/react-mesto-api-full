require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const allowedCors = [
  'https://domainname.mmuravyev.nomoredomains.sbs',
  'http://domainname.mmuravyev.nomoredomains.sbs/',
];

const app = express();

console.log(process.env.NODE_ENV);

app.use(bodyParser.json());

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(limiter);

app.use('/', authRouter);
app.use(cookieParser());
app.use(auth);
app.use(errorLogger);
app.use('/', userRouter);
app.use('/', cardRouter);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use((req, res, next) => next(new ErrorNotFound('Неправильный маршрут')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
