/*var API_HOST = "";
var API_VER = "";
var API_END_POINT_READ = API_HOST + "/read";

var face = document.getElementBuId("#face");
var audio = document.getElementBuId("#face");

function init(){
	face.addEventListener('webkitAnimationEnd', function(){
		this.style.webkitAnimationName = '';
	}, false);
}

function playAnim(id)
{

}



function playAudio(path){
	audio.src = path;
	player.onload = function(e){
		console.log("success", e);
		audio.play();
	};
	player.onerror = function(e){
		console.log("error", e);
	};
	audio.load();
}*/
//face init




//socket init
var opt = {
        forceNew: true,
        reconnection: false
    }
var socket = io.connect(":8100", opt);
socket.on('connect', function(e){
    console.log('connect');
});
socket.on('connect', function(e){
    console.log('connect');
});
socket.on('play', function(e){
    console.log(e);
    var face = document.getElementById("face");
    var player = document.getElementById("audio");
    //
    animId = e.animId;
    audioPath = e.audioPath;

    

	//play audio
    
    player.src = audioPath;
    player.onload = function(e){
        console.log("success", e);
        player.play();
    };
    player.onerror = function(e){
        console.log("error", e);
    };
    player.load();

    //play face
    face.set



});

function playFaceAnim(animId){
    var face = document.getElementById("face");
   /* face.addEventListener('webkitAnimationEnd', function(){
        this.style.webkitAnimationName = '';
    }, false);*/
    face.className = animId;
}
