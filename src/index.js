const { SSL_OP_NO_TICKET } = require('constants');
const fs = require('fs');
const path = require('path');
const cfg = require('ini').parse(fs.readFileSync(path.resolve(__dirname, '..', 'CONFIG.ini'), 'utf-8'));

const io = require('socket.io')({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.send('Hello!');

  socket.on('message', (msg) => {
    console.log(msg);
  });

  socket.onAny((event, ...args) => {
    console.log(`event: ${event}\nargs: ${args}`);
  });
});

io.listen(cfg.PORT);
