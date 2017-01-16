var sqlite = require('sqlite3').verbose();
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var dl = {};


dl.selectBetweenDates = function(start, end, callback) {
  var db = new sqlite.Database('main.db');
  var sql = 'SELECT FIRST_NAME AS "First_Name", LAST_NAME AS "Last_Name", POST_NAME AS Name, POST_CONTENT AS Content, TYPE AS Type, SERIES_NAME AS Series, DESCRIPTION AS Description, POST_DATE AS Date FROM USER_INFO INNER JOIN POST_INFO ON POST_INFO.CREATOR_ID = USER_INFO.ROWID INNER JOIN SERIES_INFO ON POST_INFO.SERIES_ID = SERIES_INFO.ROWID WHERE strftime("%Y-%m-%d", POST_DATE) BETWEEN ? AND ?;';
   db.all(sql, [start, end], function(err, rows) {
       if(err == null)
      {
        return callback(err, rows);
      } 
      else
      {
        return callback(err, {"message": "There was a error with the query"});
      } 
    });
    db.close();
};

dl.selectPost = function(rowId, callback) {
  var db = new sqlite.Database('main.db');
   var sql = 'SELECT FIRST_NAME AS "First_Name", LAST_NAME AS "Last_Name", POST_NAME AS Name, POST_CONTENT AS Content, TYPE AS Type, SERIES_NAME AS Series, DESCRIPTION AS Description, POST_DATE AS Date FROM USER_INFO INNER JOIN POST_INFO ON POST_INFO.CREATOR_ID = USER_INFO.ROWID INNER JOIN SERIES_INFO ON POST_INFO.SERIES_ID = SERIES_INFO.ROWID WHERE POST_INFO.ROWID = ?;';
   db.all(sql, [rowId], function(err, rows) {
      if(err == null)
      {
        return callback(err, rows[0]);
      } 
      else
      {
        return callback(err, {"message": "There was a error with the query"});
      } 
  });
    db.close();
};

dl.insertPost = function(creatorId, name, content, type, seriesId, callback) {
  var db = new sqlite.Database('main.db');
  var sql = "INSERT INTO POST_INFO (CREATOR_ID, POST_NAME, POST_CONTENT, TYPE, SERIES_ID) VALUES (?, ?, ?, ?, ?);";
   db.all(sql, [creatorId, name, content, type, seriesId], function(err) {
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
  var db = new sqlite.Database('main.db');
  var sql = 'INSERT INTO USER_INFO (EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, SALT, PHONE_NUMBER, PROFILE_PICTURE) VALUES (?, ?, ?, ?, ?, ?, ?);';
  db.all(sql, [email, firstName, lastName, hash, salt, phoneNumber, profilePicture], function (err) {
    if(err)
    {
      return callback(err, {"success": false, "message": "There was a error with out servers"});
    }
    else
    {
      return callback(err, {"success": true, "message": "User was created! Please login"});
    }
  });
  db.close();
};

dl.emailExists = function (email, callback) {
  var db = new sqlite.Database('main.db');
  console.log(email);
  var sql = 'SELECT EXISTS(SELECT EMAIL FROM USER_INFO WHERE EMAIL = ?) AS Taken;';
  db.all(sql, [email], function (err, row) {
    return callback(err, row[0]);
  });
  db.close();
};

dl.authUser = function (email, password, callback) {
  var db = new sqlite.Database('main.db');
  var sql = 'SELECT ROWID AS ROWID, EMAIL, PASSWORD, SALT, FIRST_NAME, LAST_NAME FROM USER_INFO WHERE EMAIL = ?;';
  db.all(sql, [email], function (err, row) {
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
  db.close();
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