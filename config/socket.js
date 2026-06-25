const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this for production security
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client joins a room identified by their email to receive targeted notifications
    socket.on('join_room', (email) => {
      if (email) {
        socket.join(email);
        console.log(`Socket ${socket.id} joined room: ${email}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
