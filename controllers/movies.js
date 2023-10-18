const mongoose = require('mongoose');
const MovieSchema = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const OkStatus = 200;
const CreatedStatus = 201;

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  MovieSchema.find({ owner })
    // .orFail()
    .then((movies) => {
        // console.log(movies)
        res.status(OkStatus).send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  return MovieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CreatedStatus).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  MovieSchema.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Передан несуществующий _id фильма.'));
        return;
      } if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы не являетесь владельцем фильма.'));
        return;
      }
      MovieSchema.deleteOne(movie)
        .orFail()
        .then(() => {
          res.status(OkStatus).send({ message: 'Фильм удален.' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Такого фильма не существует'));
          } else {
            next(err);
          }
        });
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
