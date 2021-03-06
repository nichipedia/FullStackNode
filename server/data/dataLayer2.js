var mysql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var dl = {};
var con = {
           host: 'localhost'
          ,user: 'root'
          ,password: ''
          ,database: 'harambe'
          };

dl.createUser = function (email, firstName, lastName, password, phoneNumber, profilePicture, callback) {
  var salt = generateSalt();
  var hash = generateHash(password, salt);
  var db = mysql.createConnection(con);
  var sql = 'INSERT INTO USER_INFO (EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, SALT, PHONE_NUMBER, PROFILE_PICTURE) VALUES (?, ?, ?, ?, ?, ?, ?);';
  db.query(mysql.format(sql, [email, firstName, lastName, hash, salt, phoneNumber, profilePicture]), function (err) {
    if(err)
    {
      return callback(err, {"success": false, "message": "There was a error with out servers"});
    }
    else
    {
      return callback(err, {"success": true, "message": "User was created! Please login"});
    }
  });
  db.end();
};

dl.emailExists = function (email, callback) {
  var db = mysql.createConnection(con);
  console.log(email);
  var sql = 'SELECT EXISTS(SELECT EMAIL FROM USER_INFO WHERE EMAIL = ?) AS Taken;';
  db.query(mysql.format(sql, [email]), function (err, row) {
    return callback(err, row[0]);
  });
  db.end();
};

dl.authUser = function (email, password, callback) {
  var db = mysql.createConnection(con);
  var sql = 'SELECT ROWID AS ROWID, EMAIL, PASSWORD, SALT, FIRST_NAME, LAST_NAME FROM USER_INFO WHERE EMAIL = ?;';
  db.query(mysql.format(sql, [email]), function (err, row) {
    if(err)
    {
      return callback(err, {"success": false, "message": "No user exists"});
    }
    else
    {
      var hash = generateHash(password, row[0].SALT);
      if (hash != row[0].PASSWORD)
      {
        return callback(err, {"success": false, "message": "Passwords did not match"});
      }
      else
      {
        var token = jwt.sign(row[0], 'superSecret', { expiresIn: 1440  });
        var user = {"User_Id": row[0].ROWID, "Email": row[0].EMAIL, "First_Name": row[0].FIRST_NAME, "Last_Name": row[0].LAST_NAME};
        return callback(err, {"success": true, "message": "You are Loged in!", "User_Info": user, "Token": token});
      }
    }
  });
  db.end();
};

function generateHash(password, salt) {
    return   crypto
            .createHash('sha256')
            .update(salt + password)
            .digest('base64');
}

function generateSalt() {
   return crypto.randomBytes(16).toString('base64');
}

module.exports = dl;