module.exports = function (ops) {
	console.log('here'+JSON.stringify(ops));
	var dst = ops.logs || process.stdout;
	function mod(str){
		str.replace('!T', new Date().getTime());
		return '<| '+str };
	return ops.verbose 
		? function log(args){ 
			var to_log = Array.prototype.slice.call(arguments).map(mod);
			dst.write(to_log.join('\n'))}
		: function notlog(){}}