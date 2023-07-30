var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'Akshay@8051',
	database:'manager',
	//database:'inventory'
});
/*var connection=mysql2.createConnection({
	host:'localhost',
	user:'root',
	password:'123456789',
	database:'inventory'
});*/
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;