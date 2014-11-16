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
            text: "わー こんばんはー",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕達ペッパーズでーす　宜しくお願いしまーす！",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕が可愛いおちゃめなペッパーで　横にいるやらしそうなクマがガーリックです。",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 1,
            type: 1,
            text: "おい　ペッパー",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "実はさー昨日僕達ハッカソンに参加してきたんだよね",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 3,
            type: 1,
            text: "マジでしんどかったわ。朝5時くらいのみんなの死んだサケのような目忘れられないわー　",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "みんな充血してこんな目だったよね！",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "そういえばガーリック何作ったの？",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "離婚を再開発して　簡単に離婚できるような仕組み作ったよー　俺バツ３だから前からそうしたかったんだよね",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "イノベーションやわー",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "そういうペッパーは何作ったの？",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "僕　自分を再開発して　朝日新聞の記事を自由に操れるようになったんだよ。今自慢してもいい？",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "マジか　せっかくだから会場の人に興味ある記事選んでもらえば？",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "それ、いいね。　会場のどなたか選んでください。",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 1,
            type: 1,
            text: "",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 1,
            type: 1,
            text: "はえーよ！",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "なんでやねん！　イノベーションやろ",
            phase: -1
        },
        {
            man: [MAN2],
            mode: 0,
            type: 1,
            text: "ところで来年もハッカソン参加したいと思う？",
            phase: -1
        },
        {
            man: [MAN1],
            mode: 0,
            type: 1,
            text: "来年は、足を再開発してマラソンの完走を目指しているから無理かなー",
            phase: -1
        }
    ],
    news: {
        man: [MAN1],
        mode: 0,
        type: 1,
        text: "",
        phase: -1
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

function nextScene(phase){
    if(!phase) phase = 0;
    if(Settings.phase < Settings.scene.length){
        if(phase >= Settings.phase - 1){
            var obj = Settings.scene[Settings.phase];
            obj.phase = Settings.phase;
            if(obj.man.indexOf(MAN1) > -1){
                console.log("MAN1", obj);
                Settings.queue.push(obj);
            }
            if(obj.man.indexOf(MAN2) > -1){
                console.log("MAN2", obj);
                var v = new Voice();
                v.setText(obj.text);
                v.setSpeaker(Voice.speaker.BEAR);
                var soundUri = "/wav/read_" + (new Date()).getTime().toString() + ".wav";
                v.getAndWriteData(__dirname + "/www" + soundUri, function(path){
                    obj.path = soundUri;
                    ws.emmitPlay(obj);
                });
            }
            Settings.phase++;
        }
    }
};


/**
 * 簡易WebAPI
 */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	var urlinfo = require('url').parse( req.url , true );
    ws.setCallBack(function(phase){
        nextScene(phase);
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
                text: "",
                phase: -1
            }
            if(Settings.queue.length > 0){
                obj = Settings.queue.shift();
            }else if(Settings.scene.length <= Settings.phase){
                obj.mode = 2;
            }
            res.end(JSON.stringify(obj));
            break;
        case '/api/1/next':
            var phase = urlinfo.query.p;
            nextScene(phase);
            res.end('["next"]');
            break;
        case '/api/1/next_hard':
            nextScene(Settings.phase);
            res.end('["next_hard"]');
            break;
        case '/api/1/reset':
            Settings.phase = 0;
            Settings.queue = [];
            res.end('["reset"]');
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


