
//var dataLayer = require('./data/dataLayer2');
var con = require('./data/con.json');
var mysql = require('mysql');

var connection = mysql.createConnection({ host: 'localhost',
user: 'root',
password: 'root',
database: 'bbtest',
port: '/Applications/MAMP/tmp/mysql/mysql.sock'});


connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
 
  console.log('The solution is: ', rows[0].solution);
});
 
connection.end();







