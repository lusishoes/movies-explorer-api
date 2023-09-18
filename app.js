require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;
const app = express();
const allowedCors = [
  'http://lusishoes.movies.nomoredomainsrocks.ru',
  'https://lusishoes.movies.nomoredomainsrocks.ru',
  'https://localhost:3000',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
