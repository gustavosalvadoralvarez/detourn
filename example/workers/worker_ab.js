var binom = require('../stats/tests/binom-ab.js'); 
var poisson = require('../stats/tests/poisson-ab.js'); 

module.exports = function(self) {

self.onmessage = function m (msg) { 
	var res; 
	switch(msg.method){ 
		case 'poisson': 
			res = poisson(msg.params);
		case 'binom': 
			res = binom(msg.params)
		default: 
			return self.send_wrpc(msg.id, null, 'method '+msg.method+' not found in worker')}
	if (res) { 
		self.send_wrpc(msg.id, res)}
	else { 
		self.send_wrpc(msg.id, null, 'method func failed to return a value')}}

self.send_wrpc = function s (id, results, error) {
	self.postMessage({
		'event': 'wrpc', 
		'data':{
			'id': id,
			'result': results,
			'error': 'error' || null }})}}