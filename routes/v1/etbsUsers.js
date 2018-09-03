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

router.get('/add', function(req, res, next) {
  res.render('v1/etbsUsersForm', {
    action: '/etbs-users/insert'
  });
});

router.post('/insert', function(req, res, next) {
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'INSERT INTO users SET ?';
    var user = {
      username: username,
      rolename: rolename
    };

    conn.query(sql, user, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/edit/:username/:rolename', function(req, res, next) {
  var username = req.params.username;
  var rolename = req.params.rolename;

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      var cnt = result.length ? result[0].cnt : 0;

      res.render('v1/etbsUsersForm', {
        action: '/etbs-users/update',
        username: username,
        rolename: rolename,
        cnt: cnt
      });

      conn.end();
    });
  }
});

router.post('/update', function(req, res, next) {
  var originUsername = req.body.originUsername;
  var originRolename = req.body.originRolename;
  var username = req.body.username;
  var rolename = req.body.rolename;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'UPDATE users SET ? WHERE username = ?';
    var setditions = [
      {
        username: username,
        rolename: rolename
      },
      originUsername
    ];

    conn.query(sql, setditions, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
});

router.get('/remove/:username/:rolename', function(req, res, next) {
  var username = req.params.username;
  var rolename = req.params.rolename;

  var conn = database.getConnection();

  if (conn) {
    var sql = 'SELECT COUNT(1) AS cnt FROM user_group WHERE username = ?';
    var conditions = [username];

    conn.query(sql, conditions, function (err, result) {
      var cnt = result.length ? result[0].cnt : 0;

      res.render('v1/etbsUsersForm', {
        action: '/etbs-users/delete',
        username: username,
        rolename: rolename,
        cnt: cnt
      });

      conn.end();
    });
  }
});

router.post('/delete', function(req, res, next) {
  var originUsername = req.body.originUsername;

  var conn = database.getConnection();

  if (conn) {

    var sql = 'DELETE FROM users WHERE username = ?';
    var conditions = [originUsername];

    conn.query(sql, conditions, function (err, result) {
      res.redirect('/etbs-users');
      conn.end();
    });

  }
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
