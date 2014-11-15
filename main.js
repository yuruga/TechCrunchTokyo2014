/**
 * Config
 */
var MAN1 = 0;
var MAN2 = 1;
var Settings = {
    phase: 0,
    scene: [
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕達ペッパーズでーす　宜しくお願いしまーす！"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕がイケメン担当のペッパーで　横にいる丸々なクマがガーリックです。"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "丸々"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "ねーガーリック　僕昨日から朝日新聞の記事を自由に操れるようになったから、自慢していい？"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "ほー　　聞いてやろう　せっかくだから会場の人に興味ある記事選んでもらえば？"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "それ、いいね。　会場のどなたか選んでください。"
        },
        {
            man: [MAN1],
            mode: 1,
            type: 1,
            text: ""
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "ペッパー　スゲーよく読めてた。"
        }
    ],
    queue: []
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

function nextScene(){
    if(Settings.phase < Settings.scene.length){
        var obj = Settings.scene[Settings.phase++];
        if(obj.man.indexOf(MAN1) > -1){
            console.log("MAN1");
            Settings.queue.push(obj);
        }
        if(obj.man.indexOf(MAN2) > -1){
            console.log("MAN2");
            var v = new Voice();
            v.setText(obj.text);
            v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
                obj.path = path;
                ws.emmitPlay(obj);
            });
        }
    }
};


/**
 * 簡易WebAPI
 */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	var urlinfo = require('url').parse( req.url , true );
    ws.setCallBack(function(){
        nextScene();
    });
	switch(urlinfo.pathname){
		case '/read':
			if("w" in urlinfo.query){
				var v = new Voice();
				v.setText(urlinfo.query.w);
				v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
					ws.emmitPlay({
                        path: path
                    });
				});
			}
			res.end('/Read\n');
			break;
        case '/api/1/pepper':
            var obj = {
                man: [MAN1],
                mode: -1,
                type: 1,
                text: ""
            }
            if(Settings.queue.length > 0){
                obj = Settings.queue.shift();
            }
            res.end(JSON.stringify(obj));
            break;
        case '/api/1/next':
            nextScene();
            res.end('next');
            break;
        case '/api/1/reset':
            Settings.phase = 0;
            Settings.queue = [];
            res.end('reset');
            break;
        case '/api/1/news_queue':
            var keyword = urlinfo.query.w;
            //TODO:
            var text = "新聞記事";
            res.end('added queue');
            break;
		default:
			res.end('empty\n');
	}
}).listen(8080);


