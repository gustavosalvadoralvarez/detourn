var engineio = require('engine.io');
var stream = require('stream');
// TODO: fuck callbacks, take in a stream, output a stream. 

module.exports = function Wrpc(server, ops) { 
	console.log("<|ETOURN SERVER INITIALIZING...");
	var self = this, _io, _workers=[], _workload=[], _processes=[], in_stream, out_stream, vlog;
	vlog = require('../util/verbose-logger.js')(ops);
	// main public api method call
	self.remote = function (wrpc, callback){ 
		return new _Process(wrpc, callback)};
	// convinience public methods 
	self.get_workload = function get_workload() { 
		return JSON.stringify(_workload)}
	self.num_workers = function num_workers() { 
		return _workers.length}
	self.push_to_workload = function low_priority(job) { 
		_workload.push(job)} 
	// handle sockets 
	_io = engineio(server); 
	_io.on('connection', 
		function add_worker(socket) { 
			vlog(' WORKER '+socket.id+' CONNECTED @ !T'+(new Date().getTime()));
			if (_workload.length){ 
				var job = _workload.shift();
				new _Process(job[0], job[1], socket)
				vlog(' ! DIFERRED WRPC#'+job.id+' ASSIGNED TO '+socket.id+' @ !T'+(new Date().getTime()));}
			else { _workers.unshift(socket)}})
	// main task function
	function _Process (wrpc, callback, assigned){
		var that=this, wrkr;
		that.wrpc = wrpc;
		that.callback = callback; 
		that.resolved = false;
		if (!_workers.length && !assigned) return _workload.push([wrpc, callback]);
		that.wrkr = wrkr = assigned || _workers.shift();
		wrkr.send(JSON.stringify({'wrpc': wrpc}));
		wrkr.on('message', report_wrpc);
		wrkr.on('close', reassign);
		function report_wrpc(msg) { 
			var results = JSON.parse(msg).data;
			if (!results.error) { 
				that.resolved = true;
				_workers.push(wrkr)
				callback(null, results, wrpc);
				console.log('<| WRPC#'+results.id' RESOLVED ');
				vlog(JSON.stringify(wrpc), JSON.stringify(results)+' !T')}
			else callback(results.error, null, wrpc); }
		function reassign(){ 
			if (!that.resolved) new _Process(that.wrpc, that.callback); }
		vlog('REMOTE PROCESS SUCCESSFULLY INITALIZED FOR WRPC#'+wrpc.id); }
		return self}