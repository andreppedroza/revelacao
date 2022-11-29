const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const open = require('open');
const ip = require('ip');

const app = express()
app.use(express.static('public'))

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
      });
});

server.listen(3000, ip.address(), () => {
    console.log(`Server started at ${ip.address()}:3000`);
    open(`http://${ip.address()}:3000`);
});
