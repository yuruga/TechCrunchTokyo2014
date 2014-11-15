//コンストラクタ
var AsahiApi = function(){
}

//インスタンスメソッド
AsahiApi.prototype = {

	// callbackの第一引数に検索結果の最新記事本文を入れて返します。
	
	getBody: function(keyword, callback){
		var http = require('http');
		var url = 'http://54.92.123.84/search?ackey=d8616ea1db93d1979cc41ef20717f701b740dbed&q=Body:' + keyword + '&sort=ReleaseDate desc&wt=json';

		http.get(url, function(res){
			var body = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				body += chunk;
			});
			res.on('end', function(res){
				ret = JSON.parse(body);
				var text = ret.response.result.doc[0].Body;
				callback(text);
			});
		}).on('error', function(e){
			console.log(e.message); //エラー時
			return false;
		});
	}
};

//export
module.exports = AsahiApi;


