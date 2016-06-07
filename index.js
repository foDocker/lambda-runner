const repl = require('repl');
const uuid = require('node-uuid').v4;
const MQ = require("mongomq").MongoMQ;


var context = repl.start('lambda> ').context;

context.run = (lambda, data, cb) => {
	let queue = new MQ({autostart: true, host: "mongo"});
	let hash = uuid();
	console.log("SENDING:", context.generateRequestKey(lambda), {hash, data});
	queue.emit(context.generateRequestKey(lambda), {hash, data});
	queue.once(context.generateResponseKey(hash), (error, response) => {
		if(error)
			console.error(error);
		else
			console.log("RESPONSE:", response);
		queue.stop(() => {
			if(cb) cb(error, response);
		});
	});
	return hash;
};

context.generateRequestKey	= (lambda)	=> "lambda - request - "	+ lambda;
context.generateResponseKey	= (hash)	=> "lambda - response - "	+ hash;
