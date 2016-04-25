var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost:27017/electric';
var db;
var allCars;

// create a connection with mongo
mongoClient.connect(mongoUrl, function(error, database){
	// get all cars and put them in an array
	database.collection('cars').find({}).toArray(function(error, result){
		allCars = result;
		db = database;
	});
});


/* GET home page. */
router.get('/', function(req, res, next) {
	// get the current user
	var currIP = req.ip;
	db.collection('users').find({id: currIP}).toArray(function(error, userResult){
		if (userResult.length === 0) {
			photosToShow = allCars;
		} else if (userResult.length === allCars.length) {
			// if the user has voted on all images, encourage them to add more cars, etc.
			photosToShow = allCars;
		} else {
			// otherwise just show the cars that don't have a totalVotes key
			photosToShow = allCars;
		}
		var randomPhoto = Math.floor(Math.random() * photosToShow.length);
		res.render('index', { carName: photosToShow[randomPhoto].name, carImg: photosToShow[randomPhoto].src});
	});
});


router.post('/electric', function(req, res, next){
	// update the images (cars) collection by 1
	db.collection('cars').updateOne(
		{
			name: req.body.name
		},
		{
			$inc: {"totalVotes": 1}
		}, function(error, results){console.log(results);}
	);

	// update the user's collection to include the IP address and photo they voted on
	db.collection('users').updateOne(
		{
			ip: req.ip
		},
		{
			$set: {"photo": req.body.name, "vote": "electric"}
		},
		{
			upsert: true
		},
		function(error, results){console.log(results);}
	);

	// redirect to the home page when done updating tables
	return res.redirect('/');
});

router.post('/not', function(req, res, next){
	// update the images (cars) collection by 1
	db.collection('cars').updateOne(
		{
			name: req.body.name
		},
		{
			$inc: {"totalVotes": 1}
		}, function(error, results){console.log(results);}
	);

	// update the user's collection to include the IP address and photo they voted on
	db.collection('users').updateOne(
		{
			ip: req.ip
		},
		{
			$set: {"photo": req.body.name, "vote": "not"}
		},
		{
			upsert: true
		},
		function(error, results){console.log(results);}
	);

	// redirect to the home page when done updating tables
	return res.redirect('/');
});

module.exports = router;
