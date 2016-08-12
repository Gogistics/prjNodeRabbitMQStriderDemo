'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    amqp = require('amqp'),
    body_parser = require('body-parser'),
    app = express();

app.set('port', process.env.PORT || 5200);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {pretty: true});
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.connectionStatus = 'No server connection';
app.exchangeStatus = 'No exchange established';
app.queueStatus = 'No queue established';

app.get('/', function(req, res){
  res.render('index.jade',{
      title: 'Welcome to RabbitMQ and Node/Express on AppFog',
      connectionStatus: app.connectionStatus,
      exchangeStatus: app.exchangeStatus,
      queueStatus: app.queueStatus
  });
});

app.post('/start-server', function(req, res){
  console.log('start the amqp...');
  app.rabbitMqConnection = amqp.createConnection({ host: 'localhost', port: 5672, login: 'guest', password: 'guest' });
  app.rabbitMqConnection.on('ready', function(){
    console.log('ready...');
    app.connectionStatus = 'Connected!';

    if(!res.headersSent){
      res.redirect('/');
      res.end();
    }
  });

  app.rabbitMqConnection.on('error', function(e) {
    console.log("Error from amqp: ", e);
  });
});

app.post('/new-exchange', function(req, res){
  app.e = app.rabbitMqConnection.exchange('test-exchange');
  app.exchangeStatus = 'An exchange has been established!';
  res.redirect('/');
  res.end();
});

app.post('/new-queue', function(req, res){
  app.q = app.rabbitMqConnection.queue('test-queue');
  app.queueStatus = 'The queue is ready for use!';
  res.redirect('/');
  res.end();
});

app.get('/message-service', function(req, res){
  app.q.bind(app.e, '#');

  app.message_title = 'Welcome to the messaging service';
  app.sent_message = app.sent_message || '';
  res.render('message-service.jade',{
    title: app.message_title,
    sentMessage: app.sent_message
  });
  res.end();
});

app.post('/newMessage', function(req, res){
  var newMessage = req.body.newMessage;
  app.e.publish('routingKey', { message: newMessage });

  app.q.subscribe(function(msg){
    app.message_title = 'Welcome to the messaging service';
    app.sent_message = msg.message;


    if(!res.headersSent){
      res.redirect('/message-service');
      res.end();
    }

    //res.render('message-service.jade',{
    //  title: 'You\'ve got mail!',
    //  sentMessage: msg.message
    //});

  });
});

http.createServer(app).listen( app.get('port'), function(){
  console.log('RabbitMQ + Node.js app running!');
});

