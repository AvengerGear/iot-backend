"use strict";

var util = require('util');
var events = require('events');
var Queue = require('./queue');

var Bus = module.exports = function(backend, busName) {
	var self = this;

	self.backend = backend;
	self.busName = busName;
	self.msgQueue = new events.EventEmitter();
	self.queue = {};
	self.exchange = null;
/*
	backend.connection.exchange(busName, {}, function(exchange) {
		self.exchange = exchange;
		self.emit('open');
	});
*/

	setImmediate(function() {
		self.emit('open');
	});
};

util.inherits(Bus, events.EventEmitter);

Bus.prototype.hook = function(topicPath, handler) {
	var self = this;

	var queue = self.queue[topicPath] || null;
	if (!queue)
		self.queue[topicPath] = queue = new Queue(self, topicPath);

	queue.on('message', handler);
};

Bus.prototype.publish = function(topicPath, message, callback) {
	var self = this;

	var push = self.backend.protoMan.callMethod('push', {
		name: self.busName,
		routingKey: topicPath,
		message: message
	});

	push.on('data', function(packet) {
		if (packet.status == 200) {
			if (callback)
				callback();

			return;
		}

		if (callback)
			callback(new Error('Failed to publish'));
	});
	//self.exchange.publish(topicPath, message, {}, callback || undefined);
};
