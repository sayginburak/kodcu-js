var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
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

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public", {index: "angular.html"}));

app.post("/person",function(req,resp){
    var body = req.body;
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(body,db, function() {
	      db.close();
	  });
	});
    resp.json(body);
});

app.get("/persons", function(req, resp) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  findPersons(db, function() {
	      db.close();
	  });
	});
});

app.listen(8080);