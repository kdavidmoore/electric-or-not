var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/electric';
var db;
var myCars = [];

// create a connection with mongo
mongoClient.connect(mongoUrl, function(error, database){
	db = database;
});

/* GET home page. */
router.get('/', function(req, res, next) {
	db.collection('cars').find({}).toArray(function(error, carResult){
		// get a random number between 1 and 4
		var getRandomImage = Math.floor(Math.random() * carResult.length);
		res.render('index', { carObj: carResult[getRandomImage].imageSrc });
	});
});

module.exports = router;
