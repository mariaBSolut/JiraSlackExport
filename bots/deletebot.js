module.exports = function(req, res, next) {
    if(req.query.length <= 0 || !req.query.issueID) {
      console.log('No post paramenters or missing issueID');
      return;
    }
    var connection = require('../mysqlsetup').setup();
    connection.connect();
    
    //Check if IssueId already exists 
    var delQuery = "DELETE FROM ticket WHERE ticketID="+req.query.issueID;
    connection.query( delQuery, function(err, data) {
        if(err) { console.log('error in db query'); throw err; }

        console.log("Issue Deleted");
        connection.end();
    });
}
