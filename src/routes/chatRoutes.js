const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/threads', chatController.createThread);
router.post('/threads/:threadId/messages', chatController.sendMessage);
router.get('/threads/:threadId', chatController.getThread);

module.exports = router;