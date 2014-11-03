"use strict";

var util = require('util');
var events = require('events');
var amqp = require('amqp');
var Bus = require('./bus');

var IoTBackend = module.exports = function(opt) {
	var self = this;

	self.connection = amqp.createConnection({ host: 'iots.io' });

	self.connection.on('ready', function() {
		self.emit('ready', self);
	});

	self.connection.on('error', function(err) {
		self.emit('error', err);
	});
};

util.inherits(IoTBackend, events.EventEmitter);

IoTBackend.prototype.bus = function(busName) {
	return new Bus(this, busName);
};
