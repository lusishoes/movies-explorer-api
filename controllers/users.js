const mongoose = require('mongoose');
const { NODE_ENV, JWT_SECRET } = process.env;
const UserModel = require('../models/user');
const OkStatus = 200;
const CreatedStatus = 201;
const SALT = 10;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConfilctError = require('../errors/ConflictError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getCurrentUserInfo = (req, res, next) => {
  UserModel.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(OkStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OkStatus).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

// return UserModel.create({ name, about, avatar, email, password }) /signup
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT)
    .then((hash) => UserModel.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(CreatedStatus).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConfilctError('Пользователь с таким email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

// /signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUserInfo,
  updateUserProfile
};