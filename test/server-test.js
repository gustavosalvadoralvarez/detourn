

var Detourn = require('../index.js');
var dtrn = new Detourn('./test-workers/add.js', "http://localhost", 1100, {verbose: true}); 
var wrpc = { 'method':"add","params":[1,2,3,4,5], 'id':0};
dtrn.remote(wrpc, function c(err, res){ 
	console.log(res)})


