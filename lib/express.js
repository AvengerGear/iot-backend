"use strict";

var Express = module.exports = function(opts) {
	var self = this;

	self.opts = {
		username: opts.username || '',
		password: opts.password || '',
		host: opts.host || 'iots.io',
		port: opts.port || 1115
	};
};

Express.prototype.bus = function(busName) {
	var self = this;

	var publish = function() {

		var _busName = busName;
		var message = undefined;
		if (arguments.length == 1) {
			message = arguments[0];
		} else {
			_busName = arguments[0];
			message = arguments[1];
		}

		// TODO: Send message back to specific bus via HTTP
	};

	// Express middleware
	return function(req, res, next) {

		// Invalid message
		if (!('username' in req.body) || !('password' in req.body) || !('content' in req.body)) {
			res.status(400).end();
			return;
		}

		// Checking source
		if (req.body.username != self.opts.username || req.body.password != self.opts.password) {

			// Forbidden
			res.status(403).end();
			return;
		}

		// Append methods
		res.publish = publish;
		req.message = req.body.content;

		next();
	};
};
