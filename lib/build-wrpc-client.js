var browserify = require('browserify');
var fs = require('fs');
var es = require('event-stream');

module.exports = function build(dst, worker, endpoint, callback, ops){ 
    var browserify_head, tmp_dst, tmp_fl, vlog;
    vlog = require('../util/verbose-logger.js')(ops);
    browserify_head =  "var io = require('engine.io-client'); \
                        var webworkify = require('webworkify'); \
                        var worker = webworkify(require("+JSON.stringify(worker)+")); \
                        var endpoint = "+JSON.stringify(endpoint)+"; \
                        var client = new Detourn_client(worker, endpoint); \
                        module.exports= client.start;";
    tmp_dst = './wrpc-client-tmp.js';
    tmp_fl = browserify_head+Detourn_client.toString();
    fs.writeFile(tmp_dst, tmp_fl, magic);
    function magic(err) { 
        var b, dst_stream;
        if (err) return callback(err);
        b = browserify(),
        dst_stream = fs.createWriteStream(dst);
        b.add(tmp_dst);
        b.bundle().pipe(dst_stream);
        dst_stream.on('close', done);
        function done() {
                vlog("CLIENT SCRIPT FOR WORKER @ "+worker,"CREATED @ "+dst)
                callback(null, dst)}}}


function Detourn_client(worker, endpoint) {
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

