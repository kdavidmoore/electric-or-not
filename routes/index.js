var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost:27017/electric';
var db;

// create a connection with mongo
mongoClient.connect(mongoUrl, function(error, database){
	db = database;
});


/* GET home page. */
router.get('/', function(req, res, next) {
	var allCars;
	// get all cars and put them in an array
	db.collection('cars').find().toArray(function(error, results){
		allCars = results;
	});

	// get the current user
	var currIP = req.ip;

	db.collection('users').find({ip: currIP}).toArray(function(error, userResults){
		//NEW VERSION
		var photosToShow;
		var carsVoted = [];
		if (userResults.length > 0){
			for (var i=0; i<userResults.length; i++){
				// push the names of all cars voted on by the curent user
				carsVoted.push(userResults[i].car);
			}

			db.collection('cars').find({name: {$nin: carsVoted}}).toArray(function(err, results){
				if (results.length > 0) {
					photosToShow = results;
					var randomPhoto = Math.floor(Math.random() * photosToShow.length);
					console.log("================================");
					console.log("showing the photos not voted on");
					console.log("================================");
					res.render('index', { carName: photosToShow[randomPhoto].name, carImg: photosToShow[randomPhoto].src});
				} else {
					console.log("=========================");
					console.log("redirecting to standings");
					console.log("=========================");
					res.redirect('/standings');
				}
			});
		} else {
			// if the current user has not voted, show all photos
			console.log("===================");
			console.log("showing all photos");
			console.log("===================");
			var randomPhoto = Math.floor(Math.random() * allCars.length);
			res.render('index', { carName: allCars[randomPhoto].name, carImg: allCars[randomPhoto].src});
		}

		// // OLD VERSION
		// // initialize photosToShow (will stay this value unless there are vote records available)
		// photosToShow = allCars;
		// // just show the cars that haven't been voted on
		// if (userResult.length > 0){
		// 	db.collection('cars').find({ totalVotes: { $exists: false } }).toArray(function(error, results){
		// 		if (results.length > 0) {
		// 			// set the value of photosToShow to the current query results
		// 			photosToShow = results;
		// 			console.log("==============");
		// 			console.log(results);
		// 			console.log("==============");
		// 			var randomPhoto = Math.floor(Math.random() * photosToShow.length);
		// 			res.render('index', { carName: photosToShow[randomPhoto].name, carImg: photosToShow[randomPhoto].src});
		// 		} else {
		// 			// no more photos to vote on
		// 			res.redirect('/standings');
		// 		}
		// 	}); // end query to 'cars' collection
		// } else {
		// 	var randomPhoto = Math.floor(Math.random() * photosToShow.length);
		// 	res.render('index', { carName: photosToShow[randomPhoto].name, carImg: photosToShow[randomPhoto].src});
		// }

	}); // end query to 'users' collection
});


router.post('/electric', function(req, res, next){
	// update the images (cars) collection by 1
	db.collection('cars').updateOne(
		{
			name: req.body.car
		},
		{
			$inc: {"totalVotes": 1}
		}, function(error, results){console.log(error);}
	);

	// update the users collection to include the photo voted on, the vote, and the IP address of the user
	db.collection('users').insert(
		{
			ip: req.ip,
			car: req.body.car,
			vote: "electric"
		}, function(error, results){console.log(error);}
	);

	// redirect to the home page when done updating collections
	res.redirect('/');
});

router.post('/not', function(req, res, next){
	// update the images (cars) collection by 1
	db.collection('cars').updateOne(
		{
			name: req.body.car
		},
		{
			$inc: {"totalVotes": -1}
		}, function(error, results){console.log(error);}
	);

	// update the users collection to include the photo voted on, the vote, and the IP address of the user
	db.collection('users').insert(
		{
			ip: req.ip,
			car: req.body.car,
			vote: "not"
		}, function(error, results){console.log(error);}
	);

	// redirect to the home page when done updating collections
	res.redirect('/');
});


router.get('/standings', function(req, res, next){
	// get all the photos
	db.collection('cars').find().toArray(function(error, results){
		// sort photos by total votes
		results.sort(function(a, b){
			return (b.totalVotes - a.totalVotes);
		});
		console.log(results);
		res.render('standings', { standings: results });
	}); // end query to 'cars' collection
});

module.exports = router;
