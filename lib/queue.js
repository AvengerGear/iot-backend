"use strict";

var util = require('util');
var events = require('events');

var Queue = module.exports = function(bus, topicPath) {
	var self = this;

	self.bus = bus;

	self.queue = bus.backend.protoMan.callMethod('pull', {
		name: self.busName
		// TODO: support path
	});

	self.queue.on('data', function(packet) {

		var content = this.getContent(packet);
		if (!content)
			return;

		self.emit('message', content);
	});
/*
	self.queue = null;
	bus.backend.connection.queue(bus.busName, function(q) {
		self.queue = q;

		// Catch all messages
		if (topicPath == '*') {

			q.bind(bus.exchange, '#');

			q.subscribe(function(message) {
				var data = message.data || message;
				self.emit('message', data);
			});

			return;
		}

		// Catch messages with specific topic
		q.bind(bus.exchange, topicPath);
		q.subscribe(function(message) {
			var data = message.data || message;
			self.emit('message', data);
		});
	});
*/
};

util.inherits(Queue, events.EventEmitter);
