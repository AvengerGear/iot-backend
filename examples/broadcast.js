var IoTBackend = require('../');

var backend = new IoTBackend({
	username: 'fred@avengergear.com',
	password: 'hello'
});

backend.on('ready', function(backend) {

	console.log('Connected IoT Network');

	var incoming = backend.bus('incoming');
	incoming.on('open', function() {

		setInterval(function() {
			incoming.publish('test-topic', Date.now());
		}, 1000);
	});
});

backend.on('error', function(err) {
	console.log(err);
});
