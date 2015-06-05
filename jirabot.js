module.exports = function(req, res, next) {
  var userName = req.body.user_name || 'slackbot';

  var ticket = req.body.text.match(/jiraticket\(.*?\)/g);
  var fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'";

  if(ticket && ticket[0] ) {
      var ticketnum = ticket[0];
      fin = ticketnum.substring(11, ticketnum.length-1);
  }
  var botPayload = { text: 'Ticketnumber: ' + parseInt(fin)+1 };

  //avoid infinite loop
  if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
  else { return res.status(200).end(); }
};
