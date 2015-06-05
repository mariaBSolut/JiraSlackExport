module.exports = function(req, res, next) {
  var userName = req.body.user_name || 'slackbot';

  var txtcompl = req.body.text;
  var regex = /jiraticket\(.*?\)/g;
  var resArr = txtcompl.match(regex);
  var res = resArr[0];

  var fin = "Can't read ticketnumber, please write like this: 'jiraticket(1234)'";
  console.log(res);
  if(res) {
      fin = res.substring(11, res.length-1);
  }

  var botPayload = {
    text: 'Ticketnumber, 666! \n'+ res + '\n ' + fin
  };

  //avoid infinite loop
  if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
  else { return res.status(200).end(); }
};
