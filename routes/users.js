const router = require('express').Router();
const {
  getCurrentUserInfo, updateUserProfile,
} = require('../controllers/users');
const {
  valideteUpdateUserInfo,
} = require('../middlewares/validation');

router.get('/me', getCurrentUserInfo);
router.patch('/me', valideteUpdateUserInfo, updateUserProfile);

module.exports = router;
