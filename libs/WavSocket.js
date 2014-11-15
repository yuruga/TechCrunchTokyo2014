//require
var app = require('http').createServer(function handler (req, res) {
	var path = "";
	var urlinfo = require('url').parse( req.url , true);
	if(urlinfo.pathname.match(/\/tmp\/[a-z0-9_]+\.wav$/)){
		path = urlinfo.pathname;
	}else if(urlinfo.pathname.match(/\.(html|js|css)$/)){
		path = __dirname + '/../www' + urlinfo.pathname;
	}else{
		path = __dirname + '/../www/index.html';
	}
	fs.readFile(
		path,
		function (err, data) {
			if (err) {
			  res.writeHead(500);
			  return res.end('Error loading file');
			}
			res.writeHead(200);
			res.end(data);
		}
	);
});
var io = require('socket.io')(app);
var fs = require('fs');

//コンストラクタ
var WavSocket = function(port){
	//インスタンスプロパティ
	this.socket = null;
    var _callback = null;
	app.listen(port);
	io.on('connection', function (socket) {
        this.socket = socket;
        socket.on('finish', function (data) {
            if(_callback){
                _callback();
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

