var restify = require('restify');
var mongoose = require('mongoose');
var request = require('./request');
var config = require('./config');

//Connect to the database
var db = mongoose.connect(config.db.uri);

//Create the server
var server = restify.createServer({
	name: config.server.name,
	version: config.server.version
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

//Create the REST API
server.post('/request', request.createRequest);
server.get('/request', request.retreiveRequests);
server.del('/request', request.deleteRequests);

server.get('/request/:id', request.retreiveRequest);
server.put('/request/:id', request.updateRequest);
server.del('/request/:id', request.deleteRequest);

//Start handling requests
server.listen(config.server.port, function() {
	console.log('listening on %s', server.url);
});
