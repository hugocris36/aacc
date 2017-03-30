/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var watson = require('watson-developer-cloud');
var tbot = require('node-telegram-bot-api');

var conversation = watson.conversation({
  username: 'e791fcfd-991d-4880-90b7-9a8f1bf80ee8',
  password: 'xByoKxnw8Pif',
  version: 'v1',
  version_date: '2016-09-20'
});

var context = {};
var telegramBot = new tbot('#TOKENTELEGRAM', { polling: true });

telegramBot.on('message', function (msg) {
	var chatId = msg.chat.id;	
	
conversation.message({
		workspace_id: '42613812-2b42-4817-8900-9aea511',
		input: {'text': msg.text},
		context: context
	},  function(err, response) {
		if (err)
			console.log('error:', err);
		else{
			context = response.context;
			telegramBot.sendMessage(chatId, response.output.text[0]);
		}
	});	
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});