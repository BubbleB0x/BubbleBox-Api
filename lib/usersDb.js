var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'37.77.97.144',
    port: '5601',
    user:'bbuser',
	password:'Bubble20!',
	database:'BBDB'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;