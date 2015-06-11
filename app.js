var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./bots/hellobot');
var jirabot = require('./bots/jirabot');
var exportbot = require('./bots/exportbot');
var deletebot = require('./bots/deletebot');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) { res.status(200).send('Hello World') });
app.post('/hello', hellobot);
app.post('/jira', jirabot);
app.post('/export', exportbot);
app.post('/delete', deletebot);


app.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(400).send(err.message);
});

app.listen(port, function() {
    console.log('Slack Bot listening on port ' + port);
});
