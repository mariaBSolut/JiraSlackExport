module.exports = function(req, res, next) {
    var userName = req.body.user_name || 'slackbot';

    var ticket = req.body.text.match(/jiraticket\(.*?\)/g);
    var fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'";

    if(ticket && ticket[0] ) {
        var ticketnum = ticket[0].substring(11, ticket[0].length-1);

        console.log("BUH");
        console.log(ticketnum);
        
        fin = parseInt(fin) || fin;
    }
    var botPayload = isNumber(fin) ? { text: 'Ticketnumber: ' + fin+1  } : { text: fin};

    //avoid infinite loop
    if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
    else { return res.status(200).end(); }

    function isNumber(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); }
};

