const { io } = require('socket.io-client');
const socket = io('http://localhost:5050');

socket.on('connect', () => {
  console.log('Connected to server, ID:', socket.id);
  socket.emit('join_room', 'test@test.com');
  console.log('Emitted join_room');
});

socket.on('new_notification', (notif) => {
  console.log('Received notification:', notif);
});

setTimeout(() => {
  console.log('Timeout. Exiting.');
  process.exit(0);
}, 3000);
