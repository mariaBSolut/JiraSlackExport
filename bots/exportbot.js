module.exports = function(req, res, next) {
    if(req.body.length <= 0 || !req.body.issue.id) {
      console.log('No post paramenters or missing issueID');
      return;
    }

    var connection = require('../mysqlsetup').setup();
    connection.connect();

    var ticket = req.body.issue; //Helper variables
    var project = req.body.issue.fields.project;

    //Check if IssueId already exists 
    var selectQuery = "SELECT ticketID FROM ticket WHERE ticketID="+ticket.id;
    connection.query( selectQuery, function(err, data) {
        if(err) { console.log('error in db query'); throw err; }

        var iscreate = (data.length > 0) ? false : true;
        selectCallback(iscreate);
    });

    var selectCallback = function(isCreate) {
        var baseUrl = ticket.self.match(/.*?(?=\/rest)/g);
        var url = (baseUrl.length > 0) ? (baseUrl[0]+'/projects/'+project.key+'/issues/'+ticket.key) : "";
        
        //Build Query
        var strQuery = "";
        if(isCreate) 
            strQuery = "INSERT INTO ticket(ticketID, ticketKey, projectKey, projectName, ticketUrl, ticketDescription) " +
              "VALUES(" + 
              ticket.id+",'" + 
              ticket.key+"','" + 
              project.key+"','" + 
              project.name+"','" + 
              url+"','" + 
              ticket.fields.description+"')";
        else
            strQuery = "UPDATE ticket SET " +
              "ticketID="+ticket.id + ", " +
              "ticketKey='"+ticket.key + "', " +
              "projectKey='"+project.key+"', " +
              "projectName='"+project.name+"', " +
              "ticketUrl='"+url+"', " +
              "ticketDescription='"+ticket.fields.description+"' " +
              "WHERE ticketID="+ticket.id;
        
        //Inser or Update Issue
        connection.query( strQuery, function(err, data) {
            if(err) { console.log('error in db query'); throw err; }
            isCreate ? console.log("Issue Inserted") : console.log("Issue Updated");
            connection.end();
        });
    };

    return res.status(200).end();
};
