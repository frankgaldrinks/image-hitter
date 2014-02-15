var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');

var app = express();
var server = http.createServer(app);
var io = require('./lib/sockets.js')(server);
var hit = require('./models/hits');
var routes = require('./routes')(io,hit);

function zeroFill(i) {
  return (i < 10 ? '0' : '') + i
}

function now () {
  var d = new Date()
  return d.getFullYear() + '-'
    + zeroFill(d.getMonth() + 1) + '-'
    + zeroFill(d.getDate()) + ' '
    + zeroFill(d.getHours()) + ':'
    + zeroFill(d.getMinutes()) + ':'
    + zeroFill(d.getSeconds())
}

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(function (req, res, next) {
  var ip = req.ip;
  var url = "http://ipinfo.io/" + ip + "/json"
  if (req.path.indexOf(".jpg") !== -1) {
    // console.log(req.headers);
    request(url, function (err, resp, body) {
      var data = JSON.parse(body);
      data.useragent = req.headers['user-agent'];
      data.date = now();
      data.referer = req.headers['referer'];
      hit.create(data, function(err) {
        if (err) {
          console.log(err);
        }  else {
          console.log("Saved to the DB!");
        }
      });
      io.sockets.emit("shitbox", data);
    });
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res) {
  res.send(404, "404 - Wrong Page!");
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/history', routes.history);
app.del('/delete', routes.delete);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
