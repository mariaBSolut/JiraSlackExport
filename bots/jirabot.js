module.exports = function(req, res, next) {
    var connection = require('../mysqlsetup').setup();
    connection.connect();

    var strQuery = "SELECT number FROM ticket";
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
        var fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'";

        if(ticket && ticket[0] ) {
            var ticketnum = ticket[0].substring(11, ticket[0].length-1);
            if(isNumber(ticketnum)) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i].number == ticketnum) {
                        fin = 'Ticketnumber: ' + (parseInt(ticketnum)+1)
                        break;
                    }
                    else { fin = "No matching ticketnumber found"; }
                }
            }
        }
        else { fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'"; }

        return res.status(200).json({ text: fin });
    }


    //Helper functions
    function isNumber(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); }
};

