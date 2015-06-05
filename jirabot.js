module.exports = function(req, res, next) {
  var userName = req.body.user_name || 'slackbot';

  var txtcompl = req.body.text;
  var regex = /jiraticket\(.*?\)/g;
  var resArr = txtcompl.match(regex);
  var ticket = resArr[0];

  var fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'";
  console.log(ticket);
  if(ticket) {
      console.log("yay");
      fin = ticket.substring(11, ticket.length-1);
  }

  var botPayload = {
    text: 'Ticketnumber, 666! \n'+ ticket + '\n ' + fin
  };

  //avoid infinite loop
  if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
  else { return res.status(200).end(); }
};
