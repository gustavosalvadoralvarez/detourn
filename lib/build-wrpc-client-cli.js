var browserify = require('browserify');
var fs = require('fs');

var dst = process.argv[2];
var worker = process.argv[3];
var url = process.argv[4] || 'ws://localhost:8080';

var browserify_head = "var io = require('engine.io-client'); \
var webworkify = require('webworkify'); \
var worker = webworkify(require("+JSON.stringify(worker)+ 
")); var url = "+JSON.stringify(url)+"; \
var client = new Wrpc_client(worker, url); \
module.exports= client.start;";
var tmp_dst = '../tmp/wrpc-client-tmp.js';
var tmp_fl = browserify_head+W_client.toString();

fs.writeFile(tmp_dst, tmp_fl, function magic (err){ 
    if (err) { return console.log(err)}
    else { 
        var b,dst;
        b = browserify(),
        dst_stream = require('fs').createWriteStream(dst);
        b.add(tmp_dst);
        b.bundle().pipe(dst_stream);
        console.log("wrpc client writen to "+dst)
        dst_stream.on('end', function done() {
            console.log("wrpc client writen to "+dst+"\nto require wrpc client in browserify bundle use "+tmp_dst);})}})



function Wrpc_client (worker, url) { 
    var self = this; 
    self.webworker = worker;
    self.url = url;
    self.start = function s () { 
        ws = io(self.url); 
        ws.on('open', function o (){
            var wrkr = self.webworker;
            wrkr.addEventListener('message',
                function (msg){ 
                    var wrpc = msg.wrpc
                    if (wrpc) { 
                        ws.send(wrpc)}})
            ws.on('message', function m (msg){ 
                var wrpc = msg.wrpc;
                if (wrpc) { 
                    if (wrkr){ 
                        wrkr.postMessage(wrpc)}
                    else { 
                        ws.send({"error": "webworker "+wrpc.name+" not found", id: wrpc.id})}}})
            ws.on('close', function c (){})})}
    return self }

function Detourn_client(worker, endpoint) { 
    var self = this; 
    self.webworker = worker;
    self.endpoint = endpoint;
    self.start = function init() { 
        ws = io(self.endpoint); 
        ws.on('open', function set_listeners(){
            var wrkr = self.webworker;
            wrkr.addEventListener('message',
                function o(msg){ 
                    var wrpc = msg.wrpc
                    if (wrpc) { 
                        ws.send(wrpc)}})
            ws.on('message', function i(msg){ 
                var wrpc = msg.wrpc;
                if (wrpc) { 
                    if (wrkr){ 
                        wrkr.postMessage(wrpc)}
                    else { 
                        ws.send({"error": "webworker "+wrpc.name+" not found", id: wrpc.id})}}})
            ws.on('close', function close(){})})}
    return self }
