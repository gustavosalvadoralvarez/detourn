var Detourn = require('../index.js'); 
var wrpc = new Detourn('./workers/worker_ab.js', "http://localhost", 1100, {verbose:true}); 
