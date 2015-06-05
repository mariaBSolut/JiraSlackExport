var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var jirabot = require('./jirabot');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res) { res.status(200).send('Hello World') });
app.post('/hello', hellobot);
app.post('/jira', jirabot);


app.use(function(err, req, res, next) {
      console.error(err.stack);
      res.status(400).send(err.message);
});

app.listen(port, function() {
    console.log('Slack Bot listening on port' + port);
});
