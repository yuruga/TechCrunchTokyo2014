
//socket init
var opt = {
        forceNew: true,
        reconnection: false
    }
var socket = io.connect(":8100", opt);
var player = document.getElementById("audio");

socket.on('connect', function(e){
    console.log('connect');
});
socket.on('connect', function(e){
    console.log('connect');
});
socket.on('play', function(e){
    console.log(e);
    var face = document.getElementById("face");
    //
    animId = e.mode;
    audioPath = e.path;

    

	//play audio
    
    player.src = audioPath;
    player.onload = function(e){
        console.log("success", e);
        player.play();
    };
    player.onerror = function(e){
        console.log("error", e);
    };
    player.ended = function(e){
            socket.emit("finish");
        };
    player.load();

    //play face
    face.className = animId;



});

function playFaceAnim(animId){
    var face = document.getElementById("face");
   /* face.addEventListener('webkitAnimationEnd', function(){
        this.style.webkitAnimationName = '';
    }, false);*/
    face.className = animId;
    onResize();
}

window.addEventListener('resize',onResize);

var FRAME_WIDTH = 2043;
function onResize(e){
    var face = document.getElementById("face");
    p = window.outerWidth/FRAME_WIDTH;
    console.log("aaa",window.width,window);
    face.style["transform"] = "scale("+p+")";
}
