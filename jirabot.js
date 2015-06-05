module.exports = function(req, res, next) {
  var userName = req.body.user_name || 'slackbot';

  var txtcompl = req.body.text;
  var regex = /jiraticket\(.*?\)/g;
  var res = txtcompl.match(regex);
  var fin = res.substring(11, res.length-1);
  

  var botPayload = {
    text: 'Ticketnumber, 666! \n'+ res + '\n ' + fin
  };

  //avoid infinite loop
  if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
  else { return res.status(200).end(); }
};
