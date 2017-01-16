var express = require('express');
var router = express.Router();
var dataLayer = require('../data/dataLayer2');


router

.post('/add', function (req, res) {
    var creator = req.body.creator;
    var name = req.body.name;
    var content = req.body.content;
    var type = req.body.type;
    var seriesId = req.body.series;
    dataLayer.insertPost(creator, name, content, type, seriesId, function (err, message) {
        if (err) {
            res.status(418).json(message);
        } else {
            res.status(201).json(message);
        }
    });
})

.get('/post/dates', function (req, res) {
    var startDate = req.param('start');
    var endDate = req.param('end');
    dataLayer.selectBetweenDates([startDate, endDate], function (err, rows) {
        if (err) {
            res.status(418).json(row);
        } else {
            res.status(200).json(rows);
        }
    });
})

.get('/post/:post_id', function (req, res) {
    var rowId = req.params.post_id;
    dataLayer.selectPost(rowId, function (err, row) {
        if (err) {
            res.status(418).json(row);
        } else {
            res.status(200).json(row);
        }
    });
})

.get('/emailExists', function (req, res) {
    var email = req.param('email');
    dataLayer.emailExists(email, function (err, row) {
        if (err) {
            res.status(418).json({
                "message": "There was a error with our servers...."
            });
        } else {
            res.status(200).json(row);
        }
    });
})

.get('/login', function (req, res) {
    var email = req.param('email');
    var password = req.param('password');
    dataLayer.authUser(email, password, function (err, info) {
        if (info.success) {
            res.status(200).json(info);
        } else {
            res.status(418).json(info);
        }
    })
})

.post('/register', function (req, res) {
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var phoneNumber = req.body.phoneNumber;
    dataLayer.createUser(email, firstName, lastName, password, phoneNumber, null, function (err, message) {
        if (err) {
            res.status(418).json(err);
        } else {
            res.status(201).json(message);
        }
    });
});

module.exports = router;