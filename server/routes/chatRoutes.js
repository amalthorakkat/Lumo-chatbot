const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { sendMessage } = require('../controllers/chatController');

router.post('/message', authMiddleware, sendMessage);

module.exports = router;