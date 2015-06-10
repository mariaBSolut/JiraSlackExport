module.exports = {
    setup:  function() {
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user:  'jiraslack',
            password: 'jiraslackpw!',
            database: 'jiraslack'
        });

        return connection;
    },
}
