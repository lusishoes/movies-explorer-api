const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const {
  validateUserCreation, validateUserLogin,
} = require('../middlewares/validation');

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserCreation, createUser);
module.exports = router;
