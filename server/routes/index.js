var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send({test: 'hello World!'})
})

var connection = require('../sqlconnect');
var Request = require('tedious').Request  
var TYPES = require('tedious').TYPES;  

connection.connect();
connection.on("connect", err => {
    console.log("DB Connected!");
});

router.post('/insert-user', (req, res) => {
    /**
     * もらえるデータ
     * firstName, lastName, email, password
     */
    connection.on("connect", err => {
        InsertUserFunction(connection, req.body.firstName, req.body.lastName,
            req.body.email, req.body.password);
    });
    
    res.end("Insert Success")
})



function InsertUserFunction(connection, firstName, lastName, email, password) {  
    const request = new Request("INSERT INTO UserInfo (FirstName,FamilyName,MailAddress,Password) VALUES (@FirstName,@FamilyName,@MailAddress,@Password);", function(err) {  
        if (err) {  
        console.log("error in request")
        console.log(err);}  
    });  
    request.addParameter('FirstName', TYPES.NVarChar, firstName);  
    request.addParameter('FamilyName', TYPES.NVarChar , lastName);  
    request.addParameter('MailAddress', TYPES.NVarChar , email);  
    request.addParameter('Password', TYPES.NVarChar ,password);  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
            if (column.value === null) {  
            console.log('NULL');  
            } else {  
            console.log("Product id of inserted item is " + column.value);  
            }  
        });  
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        console.log("insert connected!");
        connection.close();
    });
    connection.execSql(request);  
}  
module.exports = router;