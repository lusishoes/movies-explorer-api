const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  valideteMovieCreation,
  valideteMovieById,
} = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', valideteMovieCreation, createMovie);

router.delete('/:movieId', valideteMovieById, deleteMovie);

module.exports = router;
