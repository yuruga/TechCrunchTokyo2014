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
            text: "わー こんばんはー"
        },
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
            text: "僕が可愛いおちゃめなペッパーで　横にいるやらしそうなクマがガーリックです。"
        },
        {
            man: [MAN2],
            mode: 1,
            type: 1,
            text: "おい　ペッパー"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "実はさー昨日僕達ハッカソンに参加してきたんだよね"
        },
        {
            man: [MAN2],
            mode: 3,
            type: 1,
            text: "マジでしんどかったわ。朝5時くらいのみんなの死んだサケのような目忘れられないわー　"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "みんな充血してこんな目だったよね！"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "そういえばガーリック何作ったの？"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "離婚を再開発して　簡単に離婚できるような仕組み作ったよー　俺バツ３だから前からそうしたかったんだよね"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "イノベーションやわー"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "そういうペッパーは何作ったの？"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕　自分を再開発して　朝日新聞の記事を自由に操れるようになったんだよ。今自慢してもいい？"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "マジか　せっかくだから会場の人に興味ある記事選んでもらえば？"
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
            mode: 1,
            type: 1,
            text: "はえーよ！"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "なんでやねん！　イノベーションやろ"
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "ところで来年もハッカソン参加したいと思う？"
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "来年は、足を再開発してマラソンの完走を目指しているから無理かなー"
        }
    ],
    news: {
        man: [MAN1],
        mode: 0,
        type: 1,
        text: ""
    },
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
var AsahiApi = require('./libs/AsahiApi.js');
var os = require("os");

/**
 * WavSocket
 */
var ws = new WavSocket(8100);

function nextScene(){
    if(Settings.phase < Settings.scene.length){
        var obj = Settings.scene[Settings.phase++];
        if(obj.man.indexOf(MAN1) > -1){
            console.log("MAN1", obj);
            Settings.queue.push(obj);
        }
        if(obj.man.indexOf(MAN2) > -1){
            console.log("MAN2", obj);
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
//		case '/read':
//			if("w" in urlinfo.query){
//				var v = new Voice();
//				v.setText(urlinfo.query.w);
//				v.getAndWriteData("/tmp/read_" + (new Date()).getTime().toString() + ".wav", function(path){
//					ws.emmitPlay({
//                        path: path
//                    });
//				});
//			}
//			res.end('/Read\n');
//			break;
        case '/api/1/pepper':
            var obj = {
                man: [MAN1],
                mode: -1,
                type: 1,
                text: ""
            }
            if(Settings.queue.length > 0){
                obj = Settings.queue.shift();
            }else if(Settings.scene.length <= Settings.phase){
                obj.mode = 2;
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
            var a = new AsahiApi();
            a.getBody(keyword, function(text){
                if(text == null){
                    text = "あー、取得できなかったわー";
                }
                Settings.news.text = text;
                Settings.queue.push(Settings.news);
            });
            res.end('added queue');
            break;
		default:
			res.end('empty\n');
	}
}).listen(8080);


