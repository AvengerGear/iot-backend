var IoTBackend = require('../../');
var express = require('express');
var app = express();

var backend = new IoTBackend.Express({
	username: 'fred',
	password: '123'
});

app.post('/foo', backend.bus('test-topic'), function(req, res) {
	console.log(req.message.toString());
});

app.listen(3000);
