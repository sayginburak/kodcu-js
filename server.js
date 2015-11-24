var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');
var insertDocument = function(body,db, callback) {
	db.collection('persons').insertOne( body, function(err, result) {
	assert.equal(err, null);
	console.log("Inserted a document into the restaurants collection.");
	callback(result);
	});
};

var findPersons = function(db, callback) {
   var cursor =db.collection('persons').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public", {index: "angular.html"}));

app.post("/person",function(req,resp){
    var body = req.body;
    var db = req.db;
    var collection = db.get('persons');
    collection.insert(body)
    console.log(body+"inserted")
    resp.json(body);
});

app.get("/persons", function(req, resp) {
	console.log("persons")
	var db = req.db;
    var collection = db.get('persons');
    collection.find({},{},function(e,docs){
    	console.log(docs)
        resp.json(docs);
    });
});

app.listen(8080);