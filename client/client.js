var cliArgs = require('command-line-args');
var restify = require('restify');
var assert = require('assert');

var cli = cliArgs([
	{ name: 'help', alias: 'h', type: Boolean, description: 'Help me!' },
	{ name: 'server', alias: 's', type: String, description: 'The url of the server to connect to' },
	{ name: 'list', alias: 'l', type: Boolean, description: 'List all requests' },
	{ name: 'wipe', alias: 'w', type: Boolean, description: 'Delete ALL requests!' },
	{ name: 'create', alias: 'c', type: String, description: 'Create a new request' },
	{ name: 'retreive', alias: 'r', type: String, description: 'Retrieve a request' },
	{ name: 'update', alias: 'u', type: String, defaultOption: true, description: 'Update a request' },
	{ name: 'delete', alias: 'd', type: String, description: 'Delete a request' },
	{ name: 'url', type: String, defaultOption: true, description: 'The new Url assigned with the update command' }
]);

var options = cli.parse();
options.server = options.server ? 'http://'+options.server:'http://localhost:80';

var clientOpts = {
    url: options.server,
    version: '~1.0.0'
};

if (options.create) {
	console.log('creating request for %s', options.create);
	var requestdata = {};
	requestdata.url = options.create;

	var client = restify.createJsonClient(clientOpts);
	client.post('/request', requestdata, function(err, req, res, obj) {
		assert.ifError(err);
		console.log('created request id: %s', obj.requestId);
		client.close();
	});
} else if (options.retreive) {
	var client = restify.createStringClient(clientOpts);
	client.get('/request/'+options.retreive, function(err, req, res, obj) {
		assert.ifError(err);
		if (obj==='')
			console.log('No request found');
		else
			console.log(obj);
		client.close();
	});
} else if (options.update) {
	console.log('Updating request %s', options.update);
	var requestData = {};
	requestData.url = options.url;

	var client = restify.createJsonClient(clientOpts);
	client.put('/request/'+options.update, requestData, function(err, req, res, obj) {
		assert.ifError(err);
		console.log('Request %s updated', options.update);
		client.close();
	});

} else if (options.delete) {
	console.log('Deleting request %s', options.delete);

	var client = restify.createJsonClient(clientOpts);
	client.del('/request/'+options.delete, function(err, req, res, obj) {
		assert.ifError(err);
		console.log('Request %s deleted', options.delete);
		client.close();
	});
} else if (options.list) {
	console.log('Listing all requests');

	var client = restify.createJsonClient(clientOpts);
	client.get('/request', function(err, req, res, obj) {
		assert.ifError(err);
		console.log('%d Request(s) returned: ', obj.length);
		console.log(obj);
		client.close();
	});
} else if (options.wipe) {
	console.log('Deleting all requests');

	var client = restify.createJsonClient(clientOpts);
	client.del('/request', function(err, req, res, obj) {
		assert.ifError(err);
		console.log('Request list wiped!');
		client.close();
	});
}else {
	//Help
	console.log(cli.getUsage());
}
