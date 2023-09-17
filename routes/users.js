const router = require('express').Router();
const {
  getCurrentUserInfo, updateUserProfile
} = require('../controllers/users')
const {
  valideteUpdateUserInfo
} = require('../middlewares/validation')
// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUserInfo);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', valideteUpdateUserInfo, updateUserProfile);

module.exports = router;
