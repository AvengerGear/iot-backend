"use strict";

var util = require('util');
var events = require('events');
var net = require('net');
var msgpack = require('msgpack');
var ProtoMan = require('protoman');
var Bus = require('./bus');

var IoTBackend = module.exports = function(opts) {
	var self = this;

	self.opts = {
		username: opts.username || '',
		password: opts.password || '',
		host: opts.host || 'iots.io',
		port: opts.port || 1115
	};

	// Connecting to exchange server
	self.protoMan = null;
	self.conn = net.connect({ port: self.opts.port }, function() {
		var protoMan = self.protoMan = new ProtoMan({
			stream: self.conn
		});

		// Authorization
		var auth = protoMan.callMethod('auth', {
				username: self.opts.username,
				password: self.opts.password
		});

		auth.on('data', function(packet) {
			switch(packet.status) {
			case 200:
				self.emit('ready', self);
				break;

			case 403:
				self.emit('error', new Error('Autorization failed'));
				break;

			default:
				self.emit('error', new Error('Server error'));
			}
		});
	});

	self.conn.on('error', function(err) {
		self.emit('error', err);
	});
};

util.inherits(IoTBackend, events.EventEmitter);

IoTBackend.prototype.bus = function(busName) {
	var self = this;

	return new Bus(self, busName);
};

// Express support
IoTBackend.Express = require('./express');
