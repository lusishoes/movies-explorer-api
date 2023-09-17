const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');
const {
  valideteMovieCreation,
  valideteMovieById
} = require('../middlewares/validation');
// возвращает все сохранённые текущим пользователем фильмы
router.get('/', getMovies);

//создаёт фильм с переданными в теле
router.post('/', valideteMovieCreation,  createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', valideteMovieById, deleteMovie);

module.exports = router;
