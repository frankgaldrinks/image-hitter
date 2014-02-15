var createPagination = function (pages, page, requrl) {
  var url = require('url')
    , qs = require('querystring')
    , params = qs.parse(url.parse(requrl).query)
    , str = ''

  params.page = 0
  var clas = page == 0 ? "active" : "no"
  str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">First</a></li>'
  for (var p = 1; p < pages; p++) {
    params.page = p
    clas = page == p ? "active" : "no"
    str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
  }
  params.page = --p
  clas = page == params.page ? "active" : "no"
  str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">Last</a></li>'

  return str
};

module.exports = function(io,hit) {
  var functions = {};

  functions.index = function(req, res) {
    res.render('index', { title: 'Image Hitter' });
  };

  functions.history = function(req, res) {
    res.locals.createPagination = createPagination;
    hit.read(req, function(err, data) {
      if (err) {
        res.send("Couldnt get the history of ips");
      } else {
        console.log(data.hits);
        data.requrl = req.url;
        res.render('history', {title: "History", data: data});
      }
    });
  };

  functions.delete = function(req, res) {
    hit.destroy(req.body.id, function(err) {
      if (err) {
        res.json({message: "There was an error and it didnt delete!"});
      } else {
        res.json({message:"Deleted"});    
      }
    });
    
  };

  return functions;
};
