module.exports = function(server) {
  var io = require("socket.io").listen(server);

  io.sockets.on('connection', function (socket) {
    console.log("Connected to socket");
    // console.log(socket);
  });

  return io;
};