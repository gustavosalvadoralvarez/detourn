var io = require('engine.io-client');                         var webworkify = require('webworkify');                         var worker = webworkify(require("./workers/worker_ab.js"));                         var endpoint = "ws://localhost:1100";                         var client = new Detourn_client(worker, endpoint);                         module.exports= client.start;function Detourn_client(worker, endpoint) {
    console.log('Detourn client called'); 
    var self=this, ws; 
    self.webworker = worker;
    self.endpoint = endpoint;
    init();
    function init() { 
        console.log('Detourn client initiatlized')
        ws = io(self.endpoint); 
        ws.on('open', set_listeners);
        ws.on('message', message_in);
        function message_in(msg){ 
            console.log('Detourn received message '+JSON.stringify(msg));
            var wrpc = JSON.parse(msg).wrpc;
            if (wrpc) self.webworker.postMessage(wrpc);
            else ws.send({"error": "webworker "+wrpc.name+" not found", id: wrpc.id})}
        function message_out(msg){ 
            console.log("Detourn client received results: "+JSON.stringify(msg.data));
            var wrpc = msg.data;
            if (wrpc) ws.send(JSON.stringify(wrpc))}
        function set_listeners(){
            console.log('Detourn client io open');
            self.webworker.addEventListener('message', message_out)}}
    return self }