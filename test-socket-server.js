const { io } = require('socket.io-client');
const socket = io('http://localhost:5050');

socket.on('connect', () => {
  console.log('Test Client Connected!');
  socket.emit('join_room', 'owner@example.com');
  console.log('Joined room: owner@example.com');
});

socket.on('new_notification', (msg) => {
  console.log('Received:', msg);
});
