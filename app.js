const express = require('express');
const app = express();
const portSocketIO = process.env.PORT ||5000;
const server = require('http').createServer(app).listen(portSocketIO);

app.io = require('socket.io')(server, {'transports': ['websocket', 'polling']})

const socketId = "3030";

let percentage = 0;
let total = 100;
let errors = 30
let success = 70
let fileName = 'Registro-presenca-outubro.xls'


console.log(`Socket.IO API up and running on port: ${portSocketIO}!`);

  app.io.on('connect', (socket) => {

    if(socket.handshake.query.socketId){
      console.log(`**** User connected with User: ${socket.handshake.query.socketId} ****`)
      socket.join('personId-'+socket.handshake.query.socketId)

     if(socket.handshake.query.socketId === socketId){
      function intervalFunction() {
        percentage++;
        console.log(`Socket.IO begin process ${percentage}`)
        app.io.to('personId-'+socketId).emit('progress', {percentage})
        if (percentage === total) {
          console.log(`Socket.IO finish process`)
          app.io.to('personId-'+socketId).emit('finish', {total, errors, success, fileName})
          clearInterval(this);
          total = 0
        }
      }
      setInterval(intervalFunction, 1000);
     }

    }else{
       console.log('a new client connected')
    }

    socket.on('disconnect', (socket) => {
       console.log(`Socket ${socket} disconnected.`);
      console.log(socket)
    });
  })



module.exports = app;