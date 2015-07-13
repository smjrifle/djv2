var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var config = require('./config');

app.use(express.logger('dev'))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');

app.get('/', function(req, res){
	res.render('index.html');
});

app.get('/dj', function(req, res){
	res.render('dj.html');
});




var onlineUsers = {};
var onlineCount = 0;
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('login', function(obj){
		socket.name = obj.userid;
		if(!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj.username;
			onlineCount++;
		}
		io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
		console.log(obj.username+'Joined the chat room');
	});
	
	socket.on('disconnect', function(){
		
		if(onlineUsers.hasOwnProperty(socket.name)) {
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			delete onlineUsers[socket.name];
			onlineCount--;
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+' has left the chat room');
		}
	});
	
		socket.on('message', function(obj){
			io.emit('message', obj);
			console.log(obj.username+" message : "+obj.content);
		});
  
});

	var server = http.listen(config.port,function(){
	  	var port = server.address().port;
	  console.log('Listening in port %s',  port);
	});