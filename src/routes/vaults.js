const express = require("express");
const { requireLogin } = require('../controllers/auth');
const { getVault, setVault } = require('../controllers/vaults');

const router = express.Router();

router.get('/getUserVault', requireLogin, getVault);
router.post('/setUserVault', requireLogin, setVault);

module.exports = router;