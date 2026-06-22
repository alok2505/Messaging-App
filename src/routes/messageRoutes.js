const express = require('express');
const {
  sendMessage,
  getConversation,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/', sendMessage);
router.get('/:user1/:user2', getConversation);

module.exports = router;