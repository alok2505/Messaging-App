const User = require('../models/User');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function createUser(req, res, next) {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'username is required' });
    }

    const normalizedUsername = username.trim();
    const existingUser = await User.findOne({
      username: { $regex: `^${escapeRegex(normalizedUsername)}$`, $options: 'i' },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'username already exists' });
    }

    const user = await User.create({ username: normalizedUsername });

    return res.status(201).json({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: 1 });

    const payload = users.map((user) => ({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    }));

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
};