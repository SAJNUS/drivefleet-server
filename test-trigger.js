const { io } = require('socket.io-client');
// We need to trigger the backend to emit. 
// We can't easily emit from here unless we use the backend server object.
