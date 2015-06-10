module.exports = function(req, res, next) {
    if(req.query.length <= 0 || !req.query.issueID) {
      console.log('No post paramenters or missing issueID');
      return;
    }
    console.log(req.query.issueTest);
    console.log(req.query);

    console.log("____BUH____");
    console.log(req.body);
    console.log(req.body.id);
    console.log("____BUHEND____");

    var connection = require('../mysqlsetup').setup();
    connection.connect();

    var tick = req.query;
    //Check if IssueId already exists 
    var selectQuery = "SELECT ticketID FROM ticket WHERE ticketID="+tick.issueID;
    connection.query( selectQuery, function(err, data) {
        if(err) { console.log('error in db query'); throw err; }

        var iscreate = (data.length > 0) ? false : true;
        selectCallback(iscreate);
    });

    var selectCallback = function(isCreate) {
        var baseUrl = req.query.baseUrl;
        var url = req.query.baseUrl+'/projects/'+req.query.projectKey+'/issues/'+req.query.issueKey;
        var strQuery = "";
        if(isCreate) 
            strQuery = "INSERT INTO ticket(ticketID, ticketKey, projectKey, ticketUrl) VALUES("+tick.issueID+",'"+tick.issueKey+"','"+tick.projectKey+"','"+url+"')";
        else
            strQuery = "UPDATE ticket SET ticketID="+tick.issueID+", ticketKey='"+tick.issueKey+"', projectKey='"+tick.projectKey+"', ticketUrl='"+url+"' WHERE ticketID="+tick.issueID;
        
        //Inser or Update Issue
        connection.query( strQuery, function(err, data) {
            if(err) { console.log('error in db query'); throw err; }
            console.log("Issue Handled");
            connection.end();
        });
    };

    return res.status(200).end();
};
