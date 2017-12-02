var dbinstance = require('./models/Gallery');
var AWS = require('aws-sdk');
var async = require('async');
var _ = require('underscore');

var awsClient = new AWS.S3({
	region: 'us-east-1',
	accessKeyId: process.env.ak,
	secretAccessKey: process.env.sk
});

var params = {
	Bucket: "shubh-bucket",
}

module.exports = function(app) {

	app.get('/images', function(req, res) {
		var bag ={
			allImageData: [],
			allDBData: []
		}

		async.series([
			getImagesAws.bind(null, bag),
			getImagesDB.bind(null, bag),
			deleteImagesFromDB.bind(null, bag),
			insertImagesInDB.bind(null, bag),
			getDBImages.bind(null, bag),
			],
			function(err){
				if(err){
					res.send(err);
				}
				res.json(bag.finalDBData);
			})
	});

	app.post('/etags', function(req, res){
		var etag = req.body.etag;
		var body = {
			rating: req.body.ratingValue
		}
		if (body.rating>5){
			body.rating = 5;
		}
		dbinstance.update({etag: etag}, body, {multi: true}, function(err, obj){
			if(err){
				res.send(err);
			}
			res.json(obj);

		})
	})

};

function getImagesAws(bag, next){
	awsClient.listObjects(params, function (err, data) {
    if (err) {
      console.log(err);
      return next(true);
    } else {
      bag.allImageData = data.Contents;
	  next();
    }
  });
}

function getImagesDB(bag, next){
	dbinstance.find(function(err, array){
		if(err){
			console.log(err);
		}
		bag.allDBData = array;
		next();
	})
}

function deleteImagesFromDB(bag, next){
	async.eachSeries(bag.allDBData, function(data, nextData){
		if (!_.findWhere(bag.allImageData, {Key: data.Key})){
			dbinstance.remove({Key: data.Key}, function(err, data){
				nextData();
			});
		}
		else {
				nextData();

		}
	}, function(err, val){
		next();
	});
}

function insertImagesInDB(bag, next){
	async.eachSeries(bag.allImageData, function(data, nextData){
		if (!_.findWhere(bag.allDBData, {Key: data.Key})){
			dbinstance.create({etag: data.ETag, Key: data.Key}, function(err, data){
				nextData();
			});
		}
		else {
				nextData();
			
		}
	}, function(err, val){
		next();
	});
}

function getDBImages(bag, next){
	bag.finalDBData = [];
	dbinstance.find(function(err, array){
		if(err){
			console.log(err);
		}
		bag.finalDBData = array;
		next();
	})
}
