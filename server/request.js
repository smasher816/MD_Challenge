var restify = require('restify');
var mongoose = require('mongoose');
var url = require('url');


/*** Request Definition ***/

var Request = mongoose.model('Request', new mongoose.Schema({
	url: String,
	date: Date,
	status: {
		complete: Boolean,
		result: Object,
		message: String
	},
	html: String
}));


/*** Collection CRUD Commands ***/

exports.retreiveRequests = function(req, res, next) {
	Request.find({}, function(err, requests) {
		if (err)
			return next(err);

		var requestMap = {};
		requests.forEach(function(request) {
			requestMap[request._id] = request;
		});

		res.json(requests);
		return next();
	});
};

exports.deleteRequests = function(req, res, next) {
	Request.remove({}, function(err) {
		if (err)
			return next(err);
		res.send('');
		return next();
	});
};


/*** Individual CRUD Commands ***/

exports.createRequest = function(req, res, next) {
	//create the new request
	var request = new Request();
	request.id = req.params._id;
	request.url = req.params.url;
	request.date = new Date();
	request.status = {
		result: {},
		complete: false,
		message:'Processing'
	};
	request.html = '';

	//insert it into the database
	request.save(function(err, request) {
		if (err)
			return next(err);

		//send back the generated id
		console.log('Created request %s for %s', request._id, request.url);
		res.json({requestId: request._id});

		//process the request
		execRequest(request);
		return next();
	});
};

exports.retreiveRequest = function(req, res, next) {
	Request.findById(req.params.id, function(err,request) {
		if (err)
			return next(err);

		if (request===null) {
			//send an empty response signifying that the request does not exist
			res.send('');
		} else if (request.status.complete) {
			//send the requested sites html
			res.writeHead(200, {
				'Content-Type':'text/html',
				'Contnet-Length': Buffer.byteLength(request.html)
			});
			res.write(request.html);
			res.end();
		} else {
			//send the request information including
			res.json(request);
		}
		return next();
	});
};

exports.updateRequest = function(req, res, next) {
	//update the request's url in the database and refetch the content
	Request.findById(req.params.id, function(err, request) {
		if (request===null) {
			request.url = req.params.url;
			request.save(function(err, req) {
				if (err)
					return next(err);

				console.log('Updated request %s to fetch %s', request._id, request.url);
				execRequest(request);

			});
		}
		res.send('');
		return next();
	});
};

exports.deleteRequest = function(req, res, next) {
	//delete the request from the database
	Request.findByIdAndRemove(req.params.id, function(err,request) {
		if (err)
			return next(err);

		if (request!==null)
			console.log('Deleted request %s',request._id);
		res.send('');
		return next();
	});
};

function execRequest(request) {
	//split the url into a host and path
	urlParts = url.parse(request.url);

	//connect to the host
	console.log('Connecting to %s', urlParts.protocol+"//"+urlParts.host);
	var client = restify.createStringClient({
		url: urlparts.protocol+"//"+urlparts.host
	});

	//and async request the html content at the given path
	console.log('Fetching html for %s', urlParts.path);
	client.get(urlParts.path, function(err, req, res, data) {
		//add the returned data (html) to the request
		request.html = data;
		request.status = {
			result: err,
			complete: true,
			message: 'Completed'
		};

		//and update the database entry
		request.save(function(err, request) {
			if (err)
				return next(err);
			console.log('Request %s completed', request._id);
		});

		//close the connection as it is no longer needed
		client.close();
	});
}

