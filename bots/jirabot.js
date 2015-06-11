module.exports = function(req, res, next) {
    var connection = require('../mysqlsetup').setup();
    connection.connect();

    var strQuery = "SELECT * FROM ticket";
    connection.query( strQuery, function(err, data) {
        if(err) { console.log('error in db query'); throw err; }
        queryCallback(data);
    });

    var queryCallback = function(data) {
        connection.end();
        if(data === null || data.length <= 0) { return res.status(200).json({ text: 'No tickets found' }); }

        //Get Data from Slack Message
        var userName = req.body.user_name || 'slackbotFIXME';
        if(userName === 'slackbot') { return res.status(200).json({ text: 'No user found' }); }

        var ticket = req.body.text.match(/jiraticket\(.*?\)/g);
        var fin = "Can't read ticketnumber, please write like this: 'jiraticket(ticket-Key)'";

        if(ticket && ticket[0] ) {
            var ticketnum = ticket[0].substring(11, ticket[0].length-1);
            if(ticketnum) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i].ticketKey == ticketnum) {
                        fin = 'Ticket-Key: ' + data[i].ticketKey + '\n Projekt: ' + data[i].projectName + '\n Link: ' + data[i].ticketUrl + '\n Beschreibung: ' + data[i].ticketDescription;
                        break;
                    }
                    else { fin = "No matching ticketnumber found"; }
                }
            }
        }

        console.log("Slack Request processed");
        return res.status(200).json({ text: fin });
    }

};

