const express = require("express");
const { register, login, logout, getUserInfo, requireLogin } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireLogin, logout);
router.get('/userInfo', requireLogin, getUserInfo);

module.exports = router;
