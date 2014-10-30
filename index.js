var wrpc_server = require('./lib/wrpc-server.js');
var build_client = require('./lib/build-wrpc-client.js'); 
var http = require('http');
var fs = require('fs'); 
var path = require('path');
var verb_logger = require('./util/verbose-logger.js');


// TODO: fuck callbacks, take in a stream, output a stream. 
module.exports = Detourn; 


function Detourn(worker_uri, site_url, argv_port, ops) { 
	var self=this, client_uri, client_route, ws_endpoint, port=argv_port || 1100, vlog;
	ops = ops || {}; //type check

	console.log("<| DETOURN SERVICE STARTED \n<| WORKER @ "+worker_uri+"\n<| URL @ "+site_url+"\n<| PORT @ "+argv_port+"\n<| OPS @ "+(ops? ops.toString(): 'DEFAULTS'));
	client_uri = '../webworkers/'+path.basename(worker_uri);
	client_route = '/'+worker_uri.split('./')[1];
	ws_endpoint = 'ws://' + rmv_protocol(site_url)+':'+port; 
	vlog = verb_logger(ops);
	vlog('CLIENT ENDPOINT @' + client_route, 'WEBSOCKET ENDPOINT @ '+ws_endpoint, 'CLIENT URI @ '+client_uri);
	self.deferred = [];
	build_client(client_uri, worker_uri, ws_endpoint, init_server, ops); 
	self.remote = call_remote;
	function call_remote(wrpc, callback) { 
		console.log('<| WRPC ID@'+wrpc.id+' CALLED');
		if (self.server) self.server.remote(wrpc, callback);
		else { 
			self.deferred.push([wrpc, callback]);
			vlog('! SERVER NOT INITIALIZED', 'DEFERRING WRPC ID#'+wrpc.id) }}
	function rmv_protocol(site_url) { 
		var r = site_url.split('://'); 
		return r.length > 1 ? r.slice(1).join('://') : r; }
	function init_server(err, client_uri) { 
		var http_server;
		if (err) return console.log(err);
		http_server = http.createServer(serve_client); 
		http_server.listen(port);
		self.server = wrpc_server(http_server, ops); 
		if (self.deferred.length) self.deferred.forEach(process_deferred);
		console.log("<| DETOURN SERVER LISTENING ON :"+port);
		function process_deferred (d){ 
			self.server.remote(d[0], d[1])}
		function serve_client (req, res) {
			vlog('RECEIVED NEW CLIENT REQUEST @ !T');
			var s;
			if (req.url === client_route) { 
				res.writeHead(200, {'Content-Type':'text/javascript'});
				s = fs.createReadStream(client_uri);
				s.pipe(res);
				s.on('close', function c(err) { 
					vlog('CLIENT REQUEST SUCCESSFULY RESOLVED @ !T');
					if (err) return console.log(err);
					res.end()})}}}
	return self }