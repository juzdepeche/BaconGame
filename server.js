var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var currentID = 0;
var Matter = require('matter-js/build/matter.js');

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

var globalSocket;

var bacon = [];

app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/',express.static(__dirname + '/'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(80,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});


var engine = Engine.create();

io.on('connection',function(socket){
	setTimeout(function(){ console.log("connecting"); }, 2000);
	globalSocket = socket;
	createOneBaconPart();
	setInterval(update, 1000/60);

});

function createOneBaconPart(){
	var baconPart = Matter.Bodies.rectangle(50, 50, 50, 100)
	baconPart.label.id = 0;
	bacon[0] = baconPart;
	console.log("bacon");
	globalSocket.emit('newBaconPart', {id:baconPart.label.id,x:50,y:50,width:50,height:100});
}

function updateBaconPosition(){
	if (bacon[0]) {
		//bacon.forEach(function(baconPart){
			console.log("updateposition");
			globalSocket.emit('moveBaconPart', {id:bacon[0].label.id, x:bacon[0].position.x,y:bacon[0].position.y});
		//});
	}
}

function update() {
	console.log("update");
	updateBaconPosition();
}