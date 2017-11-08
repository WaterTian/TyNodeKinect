var fs = require("fs");
var AipSpeechClient = require("./voice/src/AipSpeech.js");
var AipFaceClient = require("./face/src/AipFace.js");

// 设置APPID/AK/SK
var APP_ID = "10197969";
var API_KEY = "6RrY713GwphErqP9t2h1m4Ne";
var SECRET_KEY = "BrOAZ8yztMLW1en0VWXFYB486cZCHVB9";

var voiceClient = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

// createVoice('123.起源.你是谁.语音识别...混沌的宇宙456', 's1');

function createVoice(txt, name) {
	// 语音合成, 附带合成参数
	voiceClient.text2audio(txt, {
		spd: 3,
		pit: 4,
		per: 3
	}).then(function(result) {
		// console.log('<text2audio>: ' + JSON.stringify(result));
		// 把data数据写入到文件
		fs.writeFileSync(name + '.mp3', result.data);
	});
}


///////////////////////face

var faceClient = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
var image = fs.readFileSync('./ty.png');
var base64Img = new Buffer(image).toString('base64');



faceClient.detect(base64Img, {
	face_fields: "age,beauty,expression,gender",
	max_face_num: 1
}).then(function(result) {
	var faceData = result.result[0];
	// console.log(faceData.age);
	console.log(faceData.beauty);
	// console.log(faceData.expression);
	console.log(faceData.gender);

	var age = Math.floor(faceData.age);
	var beauty = Math.floor(faceData.beauty*100000)*0.1;
	var gender = "先生";
	if(faceData.gender=="male"){
		if(age<30)
		{
			gender = "帅哥";
		}else{
			gender = "大叔";
		}
	}else{
		if(age<30)
		{
			gender = "美女";
		}else{
			gender = "大姐";
		}
	}
	var expression = "孤独";
	if(faceData.expression==0)
	{
		expression = "严肃";
	}
	if(faceData.expression==1)
	{
		expression = "微笑";
	}
	if(faceData.expression==2)
	{
		expression = "开心";
	}



	var txt = gender +"啊！你好。"+ age +"岁的你。依然" + expression + "着。 你还有"+beauty+" 个轮回在等着你";

    createVoice(txt, 's2');

});