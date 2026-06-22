const User = require('../models/User');
const Message = require('../models/Message');

async function sendMessage(req, res, next) {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res
        .status(400)
        .json({ error: 'sender, receiver and text are required' });
    }

    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return res
        .status(404)
        .json({ error: 'Both sender and receiver must be valid users' });
    }

    const message = await Message.create({
      sender: senderUser._id,
      receiver: receiverUser._id,
      text,
    });

    const payload = {
      id: message._id,
      sender: senderUser.username,
      receiver: receiverUser.username,
      text: message.text,
      timestamp: message.createdAt,
    };

    const io = req.app.get('io');
    io.emit('new_message', payload);

    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
}

async function getConversation(req, res, next) {
  try {
    const { user1, user2 } = req.params;

    const firstUser = await User.findOne({ username: user1 });
    const secondUser = await User.findOne({ username: user2 });

    if (!firstUser || !secondUser) {
      return res.json([]);
    }

    const messages = await Message.find({
      $or: [
        { sender: firstUser._id, receiver: secondUser._id },
        { sender: secondUser._id, receiver: firstUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('receiver', 'username');

    const payload = messages.map((message) => ({
      id: message._id,
      sender: message.sender.username,
      receiver: message.receiver.username,
      text: message.text,
      timestamp: message.createdAt,
    }));

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  sendMessage,
  getConversation,
};