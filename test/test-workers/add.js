module.exports = function(self) { 
	self.onmessage = function m(msg) {
	var data = msg.data; 
		console.log("Worker received message: "+ JSON.stringify(data));
	var res; 
	console.log(data.method)
	switch(data.method){ 
		case 'add': 
			console.log("adding...")
			res = data.params.reduce(function plus(p,c){ return p+c });
			console.log("Results: "+res);
			self.send_wrpc(data.id, res);
			break;
		default: 
			return self.send_wrpc(msg.id, null, 'method '+msg.method+' not found in worker')}}

	self.send_wrpc = function s(id, results, error) {
		console.log("Worker sending results..")
		self.postMessage({
			'event': 'wrpc', 
			'data':{
				'id': id,
				'result': results,
				'error': error || null }})}}

