var express = require('express'),
    app = express();

var connection = require('../mysqlsetup').setup();
connection.connect();

var fs = require('fs'),
    readline = require('readline'),
    sys = require('sys'),
    exec = require('child_process').exec;

var tickets = [];
var ticketRaw = {
    id : null,
    key : '',
    url : '',
    description : '',
    projectID : null,
    projectKey : '',
    projectName : ''
}
var projects = [];
var projectRaw = {
    id : null,
    key : '',
    name : ''
}

//Check if needed file exists
exec('find . -name "entities.xml"', function(error, stdout, stderr) {
    if(error) { return console.log(error); }
    
    //create Issues file
    exec('grep "Issue id" entities.xml > issues.txt', function(error, stdout, stderr) {
        if(error) { return console.log(error); }

        //create Projects file
        exec('grep "Project id" entities.xml > projects.txt', function(error, stdout, stderr) {
            if(error) { return console.log(error); }

            //If both files were created without error, get all tickets with needed information
            getIssues();
        });
    });
    
});

console.log("lived");
process.exit;

/*_________Functions____________*/

function getIssues() {
    //read file with issues 
    fs.readFile('./issues.txt', function(err, data) {
        if(err) { return console.log(err); }
        if(!data) { return console.log("Empty Issues File"); }

        var dataArr = data.toString().split("\n");
        for(var i=0; i < dataArr.length; i++) {
            var ticket = getTicket(dataArr[i]);
            if(ticket != null) { tickets.push(ticket); }

            //if current loop was the last one fill tickets with project info 
            if(i == dataArr.length-2) { getProjectInfo(); }
        }
    });
};

function getProjectInfo() {
    console.log(tickets);
    fs.readFile('./projects.txt', function(err, data) {
        if(err) { return console.log(err); }
        if(!data) { return console.log("Empty Projects File"); }

        var dataArr = data.toString().split("\n");
        for(var i=0; i < dataArr.length; i++) {
            var project = getProject(dataArr[i]);
            if(project != null) { 
              //TODO find corresponding tickets in tickets and insert project infos
            }
        }
    }
}

function getProject(line) {
    var pro = projectRaw;
    pro['id'] = line.match(/id=".*?"/g);
    pro['key'] = line.match(/key=".*?"/g);
    pro['name'] = line.match(/name=".*?"/g);

    for(var key in pro) {
      if(pro[key]) {
          var el = pro[key];
          var temp = el.toString().split('"');
          pro[key] = temp ? temp[1] : el;
      }
    }

    return (pro['id']) ? pro : null;
}

function getTicket(line) {
    var tick = ticketRaw;
    tick['id'] = line.match(/id=".*?"/g);
    tick['key'] = line.match(/key=".*?"/g);
    tick['description'] = line.match(/description=".*?"/g);
    tick['projectID'] = line.match(/project=".*?"/g);

    for(var key in tick) {
      if(tick[key]) {
          var el = tick[key];
          var temp = el.toString().split('"');
          tick[key] = temp ? temp[1] : el;
      }
    }

    return (tick['id']) ? tick : null;
}


function selectCallback(ticket) {
    strQuery = "INSERT INTO ticket(ticketID, ticketKey, projectKey, projectName, ticketUrl, ticketDescription) " +
      "VALUES(" + 
      ticket['id']+",'" + 
      ticket['key']+"','" + 
      ticket['description']+"')";

    connection.query( strQuery, function(err, data) {
        if(err) { console.log('error in db query'); throw err; }
        console.log("Issue Inserted");
    });
}

/*
            console.log(ticket);
            var selectQuery = "SELECT ticketID FROM ticket WHERE ticketID="+ticket['id'];
            connection.query( selectQuery, function(err, data) {
                console.log(ticket);
                if(err) { return console.log(err); }
                if(data.length > 0) { //new entry
                    selectCallback(ticket);
                }
            });
        };

        connection.end();
 */
