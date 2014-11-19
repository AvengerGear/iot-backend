var IoTBackend = require('../');

var backend = new IoTBackend({
	host: 'localhost',
	username: 'fred',
	password: '123'
});

backend.on('ready', function(backend) {
	console.log('Connected IoT Network');
});

backend.on('error', function(err) {
	console.log(err);
});
