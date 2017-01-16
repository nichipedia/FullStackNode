var mysql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var dl = {};
var con = require('./con.json');

dl.selectBetweenDates = function(inserts, callback) {
    var db = mysql.createConnection(con);
    db.connect();
    var sql =  'SELECT FIRST_NAME AS "First_Name", LAST_NAME AS "Last_Name", POST_NAME AS Name, POST_CONTENT AS Content, TYPE AS Type, SERIES_NAME AS Series, DESCRIPTION AS Description, POST_DATE AS Date FROM USER_INFO INNER JOIN POST_INFO ON POST_INFO.CREATOR_ID = USER_INFO.ROWID INNER JOIN SERIES_INFO ON POST_INFO.SERIES_ID = SERIES_INFO.ROWID WHERE strftime("%Y-%m-%d", POST_DATE) BETWEEN ? AND ?;';
    db.query(mysql.format(sql, inserts), function(err, rows) {
        if(err == null)
        {
            return callback(err, rows);
        } 
        else
        {
            return callback(err, {"message": "There was a error with the query"});
        } 
    });
    db.end();
};


dl.selectPost = function(rowId, callback) {
    var db = mysql.createConnection(con);
    db.connect();
    var sql = 'SELECT FIRST_NAME AS "First_Name", LAST_NAME AS "Last_Name", POST_NAME AS Name, POST_CONTENT AS Content, TYPE AS Type, SERIES_NAME AS Series, DESCRIPTION AS Description, POST_DATE AS Date FROM USER_INFO INNER JOIN POST_INFO ON POST_INFO.CREATOR_ID = USER_INFO.ROWID INNER JOIN SERIES_INFO ON POST_INFO.SERIES_ID = SERIES_INFO.ROWID WHERE POST_INFO.ROWID = ?;';
    db.query(mysql.format(sql, [rowId]), function(err, rows) {
        if(err == null)
        {
            return callback(err, row[0]);
        }
        else
        {
            return callback(err, {"message": "Your post was not found"});
        }
    });
    db.end();
};

dl.insertPost = function(creatorId, name, content, type, seriesId, callback) {
    var db = mysql.createConnection(con);
    db.connect();
    var sql = "INSERT INTO POST_INFO (CREATOR_ID, POST_NAME, POST_CONTENT, TYPE, SERIES_ID) VALUES (?, ?, ?, ?, ?);";
    db.query(mysql.format(sql, [creatorId, name, content, type, seriesId]), function(err) {
     if (err)
     {
        return callback(err, {"success": false, "message": "Post was now accepted"});
     }
     else
     {
       return callback(err, {"success": true, "message": "Post was accepted!"});
     }
    });
    db.close();
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