var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET etbs-users listing. */
router.get('/', function(req, res, next) {
  var conn = database.getConnection();

  if (conn) {
    var sql = "SELECT username, rolename FROM users";

    conn.query(sql,
    function (err, result) {
      res.render('v1/etbsUsers', { users: result });
      conn.end();
    });
  }
});

router.get('/form', function(req, res, next) {
  res.render('v1/etbsUsersForm');
});

router.post('/insert', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = "INSERT INTO users (username, rolename) "
      + "VALUES ('" + username + "', '" + rolename + "')";

    conn.query(sql,
    function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/:id', function(req, res, next) {
  res.render('v1/etbsUsersForm');
});

router.post('/update', function(req, res, next) {
  res.send('respond etbs-users');
});

router.get('/:id/remove', function(req, res, next) {
  res.render('v1/etbsUsersForm');
});

router.post('/delete', function(req, res, next) {
  res.send('respond etbs-users');
});

router.get('/:id/users-groups', function(req, res, next) {
  res.send('respond etbs-users');
});

router.post('/:id/users-groups/:username/:group_id/insert', function(req, res, next) {
  res.send('respond etbs-users');
});

router.post('/:id/users-groups/:username/:group_id/delete', function(req, res, next) {
  res.send('respond etbs-users');
});

module.exports = router;
