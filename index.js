require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.set('io', io);

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Chat backend is running',
    endpoints: {
      createUser: 'POST /users',
      listUsers: 'GET /users',
      sendMessage: 'POST /messages',
      listConversation: 'GET /messages/:user1/:user2',
    },
  });
});

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();