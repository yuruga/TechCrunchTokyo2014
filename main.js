/**
 * Config
 */
var Settings = {
	
}


/**
 * require
 */
var http = require('http');
//var mraa = require('mraa');
var exec = require('child_process').exec;
var Voice = require("./libs/VoiceService.js");
var WavSocket = require('./libs/WavSocket.js');
var os = require("os");

/**
 * WavSocket
 */
var ws = new WavSocket(8100);


/**
 * 簡易WebAPI
 */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	var urlinfo = require('url').parse( req.url , true );
	switch(urlinfo.pathname){
		case '/read':
			if("w" in urlinfo.query){
				var v = new Voice();
				v.setText(urlinfo.query.w);
				v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
					console.log(path);
					//TODO: Read
					/*var player = new Player(path);
					player.play();*/
					ws.emmitPlay(path);
				});
			}
			res.end('/Read\n');
			break;
        case '/api/1/pepper':
            var obj = [
                {
                    "text": "あいうえおかきくけこ",
                    "type": 1
                },
                {
                    "text": "なんでやねん",
                    "type": 2
                },
                {
                    "text": "そなあほなー",
                    "type": 3
                }    
            ];
            res.end(JSON.stringify(obj[Math.floor(Math.random()*obj.length)]));
            break;
		default:
			res.end('empty\n');
	}
}).listen(8080);


