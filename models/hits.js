var util = require('util');
var mongoose = require("mongoose");
var dburl = undefined;
// var _self = this;
var _this = this;

exports.connect = function(thedburl, callback) {
  dburl = thedburl;
  mongoose.connect(dburl, function(err){
    if(err){
      callback(err);
    }else {
      callback(null);
    }
  });
}

exports.disconnect = function(callback) {
  mongoose.disconnect(callback);
}

var hitSchema = mongoose.Schema({
  date: String,
  ip: String,
  referer: String,
  useragent: String,
  hostname: String,
  org: String,
  city: String,
  region: String,
  country: String,
  created: {type: Date, default: Date.now}
});

this.connect('mongodb://localhost/chat', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MongoDB!");
  }
})

var Hit = mongoose.model('Hit', hitSchema);

exports.create = function(data, callback) {
  var newHit = new Hit();
  newHit.date = data.date;
  newHit.ip = data.ip;
  newHit.referer = data.referer || "Direct Link";
  newHit.useragent = data.useragent;
  newHit.hostname = data.hostname;
  newHit.org = data.org;
  newHit.loc = data.loc || "No Coordinates";
  newHit.city = data.city;
  newHit.region = data.region;
  newHit.country = data.country;

  newHit.save(function(err) {
    if (err) callback(err);
    else callback();
  });
}

exports.read = function(req,callback) {
  var perPage = 10;
  var page = req.param('page') > 0 ? req.param('page') : 0; 

  Hit.find()
    .limit(perPage)
    .skip(perPage * page)
    .sort({created: 'desc'})
    .exec(function (err, hits) {
      Hit.count().exec(function (err, count) {
        if (err) {
          callback(err);
        } else {
          var obj = {hits: hits, 
                    page: page, 
                    pages: count / perPage};
          callback(null, obj);
        }
      });
    });
}

exports.destroy = function(id, callback) {
  id = id.replace(/"/g, '');
  console.log("The id is " + id);
  Hit.findById(id, function(err, doc) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(doc);
      doc.remove();
      callback();
    }
  });
}

