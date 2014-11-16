//require
var express = require('express');
var app = express();
//var io = require('socket.io').listen(require('http').createServer(app));
var fs = require('fs');
app.use(express.static(__dirname + '/../www/'));
//app.get('/tmp/:file', function(req, res){
//    var path = '/tmp/' + req.params.file;
//    fs.readFile(
//		path,
//		function (err, data) {
//			if (err) {
//			  return res.send('Error loading file');
//			}
//            res.setHeader('Content-Type', "audio/wav");
//			res.send(data);
//		}
//	);
//});

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//var app = require('http').createServer(function handler (req, res) {
//	var path = "";
//	var urlinfo = require('url').parse( req.url , true);
//	if(urlinfo.pathname.match(/\/tmp\/[a-z0-9_]+\.wav$/)){
//        res.setHeader("Content-Type", "audio/x-wav");
//		path = urlinfo.pathname;
//	}else if(urlinfo.pathname.match(/\.(html|js|css|jpg|png|gif)$/)){
//		path = __dirname + '/../www' + urlinfo.pathname;
//	}else{
//		path = __dirname + '/../www/index.html';
//	}
//	fs.readFile(
//		path,
//		function (err, data) {
//			if (err) {
//			  res.writeHead(500);
//			  return res.end('Error loading file');
//			}
//			res.writeHead(200);
//			res.end(data);
//		}
//	);
//});

//コンストラクタ
var WavSocket = function(port){
	//インスタンスプロパティ
	this.socket = null;
    var _callback = null;
    server.listen(port);
//	app.listen(port);
	io.on('connection', function (socket) {
        this.socket = socket;
        socket.on('finish', function (phase) {
            if(_callback){
                _callback(phase);
            }
        });
	});
    this.setCallBack = function(callback){
		_callback = callback;
	}
}
//クラスプロパティ
//WavSocket.sample_class_prop = "value";
//インスタンスメソッド
WavSocket.prototype = {
	emmitPlay: function(obj){
		io.emit("play", obj);
	}
};


//export
module.exports = WavSocket;

