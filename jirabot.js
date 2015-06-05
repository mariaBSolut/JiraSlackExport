module.exports = function(req, res, next) {
  var txt = req.body.text;
  var userName = req.body.user_name || 'slackbot';
  var botPayload = {
    text: 'Ticketnumber, 666!'+ txt;
  };

  //avoid infinite loop
  if(userName !== 'slackbot') { return res.status(200).json(botPayload); }
  else { return res.status(200).end(); }
};
