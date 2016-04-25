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
	// return the array containing all cars
	db.collection('cars').find({}).toArray(function(error, carResult){
		// choose a random car index between 1 and 4
		var getRandomImage = Math.floor(Math.random() * carResult.length);
		res.render('index', { carObj: carResult[getRandomImage].imageSrc});
	});
});

// set up the electric page
router.post('/electric', function(req, res, next){
	res.send(req.body);
});

// set up the not electric page
router.post('/not', function(req, res, next){
	res.send(req.body);
});

module.exports = router;
