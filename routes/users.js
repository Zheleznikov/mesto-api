const router = require('express').Router();
const { getUsers, getCurrentUser, updateMyProfile, updateMyAvatar } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getCurrentUser);
router.patch('/users/me', updateMyProfile);
router.patch('/users/me/avatar', updateMyAvatar);

module.exports = router;
